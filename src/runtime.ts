import { Engine } from "./language/engine.ts";
import { Environment } from "./language/environment.ts";
import type { EnvDefineConfig } from "./language/types.ts";

export class FormulaRuntime extends Engine {
	constructor() {
		const env = new GlobalEnvironment();

		env.define({
			type: "function",
			linkname: "if",
			description:
				"Conditional function that executes one of two branches based on a condition. \n\nUsage: `if(condition, trueBranch, falseBranch)`",
			fn: FormulaRuntime._if,
		});

		super(env);
	}

	private static _if: EnvDefineConfig<GlobalEnvironment>["fn"] = (_, args) => {
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

export class GlobalEnvironment extends Environment {
	constructor() {
		super(null);
	}
}
