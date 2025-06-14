import { Arguments } from "./arguments.js";
import type { Formula } from "./formula.ts";
import { Instance } from "./instance.js";
import type {
	EnvDefineConfig,
	FunctionDefinition,
	VariableDefinition,
} from "./types.js";
import { BaseValue, CallTrait, None, type Value } from "./core/index.js";
import { CallExpr } from "../ast.js";

export class Fn extends BaseValue {
	typeHint: string = "Fn";

	asString(): string {
		return `[Function: ${this.define.linkname}]`;
	}

	asBoolean(): boolean {
		return true;
	}
	asNumber(): number {
		return NaN;
	}

	isNone(): boolean {
		return false;
	}

	constructor(
		public define: FunctionDefinition,
		public readonly env: Environment
	) {
		super();
	}

	call(args: Value[]): Value {
		return this.define.fn(this.env, new Arguments(args)) ?? None;
	}
}
Fn.addImpl(CallTrait, {
	call(me: Value, _: Environment, args: Value[]) {
		if (!(me instanceof Fn)) {
			throw new Error(
				`First parameter to Fn.call must be a Fn but got ${me.typeHint}`
			);
		}
		return me.call(args);
	},
});

export class Environment {
	private _variables: Map<string, VariableDefinition> = new Map();

	protected _parent: Environment | null = null;

	get parent(): Environment | null {
		return this._parent;
	}

	constructor(parent: Environment | null = null) {
		this._parent = parent;
	}

	get(name: string): Value | null {
		const variable = this._variables.get(name);
		if (variable) {
			if (typeof variable.getValue === "function") {
				return variable.getValue(this);
			} else {
				return variable.getValue;
			}
		} else {
			return this._parent?.get(name) ?? null;
		}
	}

	define(def: EnvDefineConfig<this>): this {
		if (def.type === "function") {
			this.define({
				type: "variable",
				linkName: def.linkname,
				description: def.description,
				override: false,
				getValue: new Fn(def as FunctionDefinition, this),
			});
		} else if (def.type === "variable") {
			if (!def.override && this._variables.has(def.linkName)) {
				throw new Error(`Name '${def.linkName}' is already defined.`);
			}
			this._variables.set(def.linkName, def as VariableDefinition);
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
