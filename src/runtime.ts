import { Environment } from "./language/environment.js";
import type { EnvDefineConfig } from "./language/types.js";

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
	}

	private static _if: EnvDefineConfig<FormulaRuntime>["fn"] = (_, args) => {
		const condition = args.get(0).asBoolean();
		const trueBranch = args.get(1);
		const falseBranch = args.get(2);
		if (condition) {
			return trueBranch;
		} else {
			return falseBranch;
		}
	};
}
