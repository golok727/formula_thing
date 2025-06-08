import type { Arguments } from "./arguments.js";
import type { Environment } from "./environment.js";
import type { Value } from "./core/value.js";

export type EnvDefineConfig<Env extends Environment = Environment> =
	FunctionDefinition<Env>;

export type FunctionDefinition<Env extends Environment = Environment> = {
	type: "function";
	linkname: string;
	description?: string;
	fn: (env: Env, args: Arguments) => Value | void;
};
