import { MockDataSource, type DataSource } from "./__mock.js";
import {
	Environment,
	Formula,
	Engine,
	type EnvDefineConfig,
} from "./language/index.js";
import { FormulaRuntime } from "./runtime.ts";

const src = `
if(prop("Age") > 18, "Adult", "Minor")
`.trim();

let source1 = new MockDataSource({
	Age: {
		"1": 20,
		"2": 16,
	},
	Name: {
		"1": "Alice",
		"2": "Bob",
	},
});
class DataViewFormulaEnvironment extends Environment {
	_currentRowId: string | null = null;

	constructor(public readonly dataSource: DataSource) {
		super();

		this.define({
			type: "function",
			description: "Get the value of a column in the current row",
			linkname: "prop",
			fn: this._prop,
		});
	}

	private _prop: EnvDefineConfig<this>["fn"] = (env, args) => {
		let currentRowId = this._currentRowId;
		let row = args.get(0);
		console.log("Prop called with row:", row, "currentRowId:", currentRowId);
	};

	setCurrentRowId(rowId: string | null): void {
		this._currentRowId = rowId;
	}
}

let rt = new FormulaRuntime();
const [formula, errors] = new Formula("Test Formula", src).compileSafe();
if (errors) {
	throw new Error(`Compilation errors: ${errors.join(", ")}`);
}
const instance = rt.createInstance(
	formula,
	new DataViewFormulaEnvironment(source1)
);

instance.environment.setCurrentRowId("1");
let res = rt.eval(instance);
console.log(res);
