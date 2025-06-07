import { Environment } from "./environment.js";
import type { Formula } from "./formula.js";
import { Instance } from "./instance.js";

export class Engine {
	constructor(public readonly environment: Environment) {}

	createInstance<Env extends Environment>(
		formula: Formula,
		environment: Env
	): Instance<Env>;
	createInstance(formula: Formula): Instance;
	createInstance(
		formula: Formula,
		environment?: Environment
	): Instance<Environment> {
		const env = environment
			? environment.setBase(this.environment)
			: this.environment;
		return new Instance(formula, env);
	}

	eval(instance: Instance) {
		return instance.formula.toString();
	}
}
