import { MockDataSource, type DataSource } from "./__mock.js";
import {
	Environment,
	Formula,
	type EnvDefineConfig,
} from "./language/index.js";
import { BooleanValue, NumberValue, StringValue } from "./language/value.js";
import { Lexer } from "./parser/lexer.js";
import { Parser } from "./parser/parse.js";
import { FormulaRuntime } from "./runtime.js";

let source1 = new MockDataSource({
	Age: {
		"1": 20,
		"2": 12,
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

	private static _prop: EnvDefineConfig<RowEnvironment>["fn"] = (env, args) => {
		let rowId = env.rowId;
		let colName = args.get(0);
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
		concat(prop("Name"), " is ", "Adult"), 
		concat(prop("Name"), " is ", "Minor")
 ) 
`.trim();

// const lexer = new Lexer(src);
// const tokens = [...lexer].map((t) => t.toString());
// console.log(tokens.join("\n"));

// gives functions like `if`..
let rt = new FormulaRuntime();
rt.define({
	type: "function",
	linkname: "now",
	description: "Returns the current date and time",
	fn: () => {
		return new StringValue(new Date().toDateString());
	},
});
// for each database create a new environment
let sourceEnv = new DataViewFormulaEnvironment(source1);
const [formula, error] = new Formula("Test Formula", src).compileSafe();
if (error) {
	console.error("Compilation errors:", error);
	throw new Error("Compilation failed");
}
// each cell can have its own instance of the formula
const row1 = rt.createInstance(formula, new RowEnvironment("1", sourceEnv));
const row2 = rt.createInstance(formula, new RowEnvironment("2", sourceEnv));

console.log(row1.eval().asString());
console.log(row2.eval().asString());
