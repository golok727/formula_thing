import { Arguments } from "./arguments.js";
import type { Formula } from "./formula.ts";
import { Instance } from "./instance.js";
import type { EnvDefineConfig, FunctionDefinition } from "./types.js";
import { None, type Value } from "./value.js";

export class Fn {
	constructor(
		public define: FunctionDefinition,
		public readonly env: Environment
	) {}

	call(args: Value[]): Value {
		return this.define.fn(this.env, new Arguments(args)) ?? None;
	}
}
export class Environment {
	private _functions: Map<string, Fn> = new Map();

	protected _parent: Environment | null = null;

	get parent(): Environment | null {
		return this._parent;
	}

	constructor(parent: Environment | null = null) {
		this._parent = parent;
	}

	getFunction(linkname: string): Fn | null {
		// todo cache ?
		return (this._functions.get(linkname) ??
			this._parent?.getFunction(linkname) ??
			null) as never;
	}

	define(def: EnvDefineConfig<this>): void {
		if (def.type === "function") {
			if (this._functions.has(def.linkname)) {
				throw new Error(
					`Function '${def.linkname}' is already defined in this environment.`
				);
			}
			this._functions.set(
				def.linkname,
				new Fn(def as EnvDefineConfig, this) as never as Fn
			);
		}
	}

	// Create an instance with this environment available
	createInstance<Env extends Environment>(
		formula: Formula,
		instanceEnv: Env
	): Instance<Env>;
	createInstance(formula: Formula): Instance;
	createInstance(
		formula: Formula,
		instanceEnv?: Environment
	): Instance<Environment> {
		if (instanceEnv) {
			let topMostParent = instanceEnv;
			while (topMostParent && topMostParent.parent) {
				topMostParent = topMostParent.parent;
			}
			topMostParent.setParent(this);
			return new Instance(formula, instanceEnv);
		} else {
			return new Instance(formula, this);
		}
	}

	setParent(parent: Environment): this {
		if (parent === this) {
			return this;
		}
		this._parent = parent;
		return this;
	}
}
