import type { EnvDefineConfig } from "./types.js";

export class Environment {
	protected _parent: Environment | null = null;

	constructor(parent: Environment | null = null) {
		this._parent = parent;
	}

	define(def: EnvDefineConfig<this>): void {}

	setBase(base: Environment): this {
		if (base === this) {
			throw new Error("Cannot set the same environment as base.");
		}
		this._parent = base;
		return this;
	}
}
