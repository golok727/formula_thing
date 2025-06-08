import {
	addTrait as addImpl,
	getImpl,
	type Trait,
	type ValueConstructor,
} from "./index.js";

export interface Value {
	readonly typeHint: string;

	asString(): string;
	asBoolean(): boolean;
	asNumber(): number;
	isNone(): boolean;

	getImpl<T>(trait: Trait<T>): T;
}

export abstract class BaseValue implements Value {
	abstract typeHint: string;

	abstract asString(): string;
	abstract asBoolean(): boolean;
	abstract asNumber(): number;
	abstract isNone(): boolean;

	getImpl<T>(trait: Trait<T>): T {
		return getImpl<T>(this.constructor as ValueConstructor, trait);
	}

	static getImpl<T>(trait: Trait<T>): T {
		return getImpl<T>(this as unknown as ValueConstructor, trait);
	}

	static addImpl<T>(trait: Trait<T>, impl: T, replace?: boolean) {
		addImpl<T>(this as unknown as ValueConstructor, trait, impl, replace);
	}

	static is(value: Value): boolean {
		return value instanceof this;
	}
}
