import { Environment } from "../language/environment.js";
import type { FunctionDefinition } from "../language/types.js";
import {
	BooleanValue,
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
			linkname: "if",
			description:
				"Conditional function that executes one of two branches based on a condition. \n\nUsage: `if(condition, trueBranch, falseBranch)`",
			fn: FormulaRuntime._if,
		});

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
			type: "value",
			linkName: "None",
			description: "Represents a None value, similar to null or undefined.",
			getValue: () => None,
		});
	}

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
		return new StringValue(args.args.map((arg) => arg.asString()).join(""));
	};

	private static _if: FunctionDefinition<FormulaRuntime>["fn"] = (_, args) => {
		const condition = args.get(0).asBoolean();
		const trueBranch = args.get(1);
		const falseBranch = args.get(2);
		// todo error handling
		if (trueBranch.isNone() || falseBranch.isNone()) {
			throw new Error(
				"Insufficient arguments for if function. Expected 3 arguments: condition, trueBranch, falseBranch."
			);
		}
		if (condition) {
			return trueBranch;
		} else {
			return falseBranch;
		}
	};
}
