import { MockDataSource, type DataSource } from "./__mock.js";
import {
	Environment,
	Formula,
	type EnvDefineConfig,
} from "./language/index.js";
import { BooleanValue, NumberValue, StringValue } from "./language/value.js";
import { FormulaRuntime } from "./runtime.js";

let source1 = new MockDataSource({
	Age: {
		"1": 20,
		"2": 18,
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
if(prop("Age") >= 18, "Adult", "Minor")
`.trim();

// gives functions like `if`..
let rt = new FormulaRuntime();

// for each database create a new environment
let sourceEnv = new DataViewFormulaEnvironment(source1);

const [formula, errors] = new Formula("Test Formula", src).compileSafe();
if (errors) {
	throw new Error(`Compilation errors: ${errors.join(", ")}`);
}
// each cell can have its own instance of the formula
const i1 = rt.createInstance(formula, new RowEnvironment("1", sourceEnv));
const i2 = rt.createInstance(formula, new RowEnvironment("2", sourceEnv));

console.log(i1.eval().asString());
console.log(i2.eval().asString());
