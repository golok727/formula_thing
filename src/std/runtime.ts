import { Environment } from "../language/environment.js";
import type { EnvDefineConfig } from "../language/types.js";
import { StringValue } from "../language/core/index.js";

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
	}

	private static _concat: EnvDefineConfig<FormulaRuntime>["fn"] = (_, args) => {
		return new StringValue(args.args.map((arg) => arg.asString()).join(""));
	};

	private static _if: EnvDefineConfig<FormulaRuntime>["fn"] = (_, args) => {
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
