import { MockDataSource, type DataSource } from "./__mock.js";
import {
	BooleanValue,
	NumberValue,
	StringValue,
	Environment,
	Formula,
	type FunctionDefinition,
	CallTrait,
} from "./language/index.js";
import { FormulaRuntime } from "./std/runtime.js";
import { evaluateFormula } from "./utils.js";

let source1 = new MockDataSource({
	Age: {
		"1": 20,
		"2": 11,
	},
	Name: {
		"1": "Alice",
		"2": "Bob",
	},
});

class DataViewFormulaEnvironment extends Environment {
	constructor(public readonly dataSource: DataSource) {
		super();
		this.define({
			type: "function",
			description: "Name of the data source",
			linkname: "sourceName",
			fn: () => {
				return new StringValue(this.dataSource.getTitle());
			},
		});
	}
}

class RowEnvironment extends Environment {
	constructor(
		public readonly rowId: string,
		parent: DataViewFormulaEnvironment
	) {
		super(parent);
		this.define({
			type: "function",
			description: "Get the value of a column in the current row",
			linkname: "prop",
			fn: RowEnvironment._prop,
		});
	}

	private static _prop: FunctionDefinition<RowEnvironment>["fn"] = (
		env,
		args
	) => {
		let rowId = env.rowId;
		let colName = args.get(0);
		if (colName.isNone()) {
			throw new Error("Column name must be provided to prop function.");
		}
		let cell = (env.parent as DataViewFormulaEnvironment).dataSource.getCell(
			rowId,
			colName.asString()
		);
		switch (typeof cell) {
			case "string":
				return new StringValue(cell);
			case "number":
				return new NumberValue(cell);
			case "boolean":
				return new BooleanValue(cell);
		}
	};
}

const src = `
if(
	prop("Age") >= 18, 
	prop("Name") + " is " + "Adult",
	if(
		prop("Age") >= 10,
		prop("Name") +  " is " + "Teenager",
		prop("Name")+ " is "+ "Child"
	)
)
`.trim();

// gives functions like `if`, 'concat' etc..
let rt = new FormulaRuntime();
rt.define({
	type: "function",
	linkname: "now",
	description: "Returns the current date and time",
	fn: () => {
		return new StringValue(new Date().toDateString());
	},
});
rt.define({
	type: "function",
	linkname: "let",
	fn: (env, args) => {
		const defName = args.get(0).asString();
		const value = args.get(1);
		env.define({
			type: "value",
			linkName: defName,
			override: true,
			value: value,
		});
		return value;
	},
});

// for each database create a new environment
let sourceEnv = new DataViewFormulaEnvironment(source1);
const [formula, error] = new Formula(src, "First formula").compileSafe();
if (error) {
	console.error("Compilation errors:", error);
	throw new Error("Compilation failed");
}
// each cell can have its own instance of the formula
const row1 = rt.createInstance(formula, new RowEnvironment("1", sourceEnv));
const row2 = rt.createInstance(formula, new RowEnvironment("2", sourceEnv));

console.log(row1.eval().asString());
console.log(row2.eval().asString());

const fizzBuzz = `
range(1, 100).map(|n| 
		(n % 3 == 0 and n % 5 == 0) ? "Fizzbuzz" : 
		(n % 3 == 0) ? "Fizz": 
		(n % 5 == 0) ? "Buzz" : n
	)
`;

console.log("\n\n");
console.log("Example FizzBuzz:\n--------------------");
console.log(evaluateFormula(fizzBuzz, new Environment(rt)).asString());

{
	console.log("\n\n");
	console.log("Example Fibonacci:\n--------------------");
	const env = new Environment(rt);

	{
		const n = 10;
		const fibDefine = `
		let("fib", |n| (n <= 1) ? n : fib(n - 1) + fib(n - 2) )
	`;
		let fibFn = evaluateFormula(fibDefine, env);
		let res = fibFn.getImpl(CallTrait).call(fibFn, env, [new NumberValue(n)]);
		console.log(`Fib(${n}) = ${res.asNumber()}`);
	}

	{
		const read = `
			range(0, 10 + 1).map(fib)
		`;
		console.log(evaluateFormula(read, env).asString());
	}
}
