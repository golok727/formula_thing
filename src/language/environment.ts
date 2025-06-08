import { Arguments } from "./arguments.js";
import type { Formula } from "./formula.ts";
import { Instance } from "./instance.js";
import type {
	EnvDefineConfig,
	FunctionDefinition,
	VariableDefinition,
} from "./types.js";
import { None, type Value } from "./core/index.js";

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
	private _variables: Map<string, VariableDefinition> = new Map();

	protected _parent: Environment | null = null;

	get parent(): Environment | null {
		return this._parent;
	}

	constructor(parent: Environment | null = null) {
		this._parent = parent;
	}

	getVariable(name: string): Value | null {
		const variable = this._variables.get(name);
		if (variable) {
			if (typeof variable.getValue === "function") {
				return variable.getValue(this);
			} else {
				return variable.getValue;
			}
		} else {
			return this._parent?.getVariable(name) ?? null;
		}
	}

	getFunction(linkname: string): Fn | null {
		// todo cache ?
		return (this._functions.get(linkname) ??
			this._parent?.getFunction(linkname) ??
			null) as never;
	}

	define(def: EnvDefineConfig<this>): this {
		if (def.type === "function") {
			// todo name validation
			// we need parent check as well
			if (this._functions.has(def.linkname)) {
				throw new Error(
					`Function '${def.linkname}' is already defined in this environment.`
				);
			}
			this._functions.set(
				def.linkname,
				new Fn(def as FunctionDefinition, this) as never as Fn
			);
		} else if (def.type === "variable") {
			// todo name validation
			if (this._variables.has(def.name)) {
				throw new Error(
					`Variable '${def.name}' is already defined in this environment.`
				);
			}
			this._variables.set(def.name, def as VariableDefinition);
		}

		return this;
	}

	/**
	 * Create an instance providing this environment:
	 */
	createInstance<Env extends Environment>(
		formula: Formula,
		env: Env
	): Instance<Env>;
	createInstance(formula: Formula): Instance<this>;
	createInstance(formula: Formula, env?: Environment): Instance<Environment> {
		env ??= this;
		let curRoot = env;
		while (curRoot && curRoot.parent) {
			if (curRoot === this) {
				return new Instance(formula, this);
			}
			curRoot = curRoot.parent;
		}
		curRoot.setParent(this);
		return new Instance(formula, env);
	}

	setParent(parent: Environment): this {
		if (parent === this) {
			return this;
		}
		this._parent = parent;
		return this;
	}
}
