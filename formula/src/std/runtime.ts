import { Environment } from "../language/environment.js";
import type { FunctionDefinition } from "../language/types.js";
import {
	BooleanValue,
	List,
	None,
	NumberValue,
	StringValue,
} from "../language/core/index.js";

/**
 * This environment provides the standard library functions
 */
export class FormulaRuntime extends Environment {
	constructor() {
		super(null);

		this.define({
			type: "function",
			linkname: "concat",
			description:
				"Concatenates multiple string values into a single string. \n\nUsage: `concat(value1, value2, ...)`",
			fn: FormulaRuntime._concat,
		});

		this.define({
			type: "function",
			linkname: "string",
			description: "convert a value to a string",
			fn: FormulaRuntime._string,
		});

		this.define({
			type: "function",
			linkname: "number",
			description: "convert a value to a number",
			fn: FormulaRuntime._number,
		});

		this.define({
			type: "function",
			linkname: "bool",
			description: "convert a value to a boolean",
			fn: FormulaRuntime._bool,
		});

		this.define({
			type: "function",
			linkname: "range",
			description:
				"Generates a list of numbers. \n\nUsage: `range([start,] end)` where `start` is optional and defaults to 0.",
			fn: FormulaRuntime._range,
		});

		this.define({
			type: "value",
			linkName: "None",
			description: "Represents a None value, similar to null or undefined.",
			value: () => None,
		});
	}

	private static _range: FunctionDefinition<FormulaRuntime>["fn"] = (
		_,
		args
	) => {
		if (args.length === 0) {
			return new List([]);
		}
		if (args.length === 1) {
			const end = args.get(0).asNumber();
			return new List(
				Array.from({ length: end }, (_, i) => new NumberValue(i))
			);
		}
		if (args.length === 2) {
			const start = args.get(0).asNumber();
			const end = args.get(1).asNumber();
			return new List(
				Array.from(
					{ length: end - start },
					(_, i) => new NumberValue(i + start)
				)
			);
		}
		throw new Error("range() function requires either 0, 1, or 2 arguments.");
	};

	private static _bool: FunctionDefinition<FormulaRuntime>["fn"] = (
		_,
		args
	) => {
		if (args.length <= 0) {
			throw new Error("bool() function requires at least one argument.");
		}
		const a = args.get(0);
		return new BooleanValue(a.asBoolean());
	};

	private static _number: FunctionDefinition<FormulaRuntime>["fn"] = (
		_,
		args
	) => {
		if (args.length <= 0) {
			throw new Error("number() function requires at least one argument.");
		}
		const a = args.get(0);
		return new NumberValue(a.asNumber());
	};

	private static _string: FunctionDefinition<FormulaRuntime>["fn"] = (
		_,
		args
	) => {
		if (args.length <= 0) {
			throw new Error("string() function requires at least one argument.");
		}
		const a = args.get(0);
		return new StringValue(a.asString());
	};

	private static _concat: FunctionDefinition<FormulaRuntime>["fn"] = (
		_,
		args
	) => {
		return new StringValue(args.raw.map((arg) => arg.asString()).join(""));
	};
}
