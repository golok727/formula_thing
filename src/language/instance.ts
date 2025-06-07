import type { Environment } from "./environment.js";
import type { Formula } from "./formula.js";
import type { EnvDefineConfig } from "./types.js";

export class Instance<Env extends Environment = Environment> {
	constructor(
		public readonly formula: Formula,
		public readonly environment: Env
	) {
		if (!formula.isCompiled()) {
			throw new Error("Formula must be compiled before creating an instance.");
		}
	}

	define(def: EnvDefineConfig<Env>): this {
		this.environment.define(def);
		return this;
	}
}
