import type { Value } from "./value.js";

export type Trait<T> = {
	readonly id: string;
	_marker?: T;
	map<U>(): Trait<U>;
};

export function defineTrait<T>(id: string): Trait<T> {
	return {
		id,
		_marker: undefined as never,
		map: <U>() => defineTrait<U>(id) as Trait<U>,
	};
}

export type ValueConstructor = new (...args: any[]) => Value;

const traitMap: Map<ValueConstructor, Map<string, any>> = new Map();

export function getImpl<T>(ctor: ValueConstructor, trait: Trait<T>): T {
	if (!traitMap.has(ctor)) {
		throw new Error(`No traits defined for ${ctor.name}.`);
	}
	const implMap = traitMap.get(ctor)!;

	if (!implMap.has(trait.id)) {
		throw new Error(`Trait ${trait.id} is not implemented for ${ctor.name}.`);
	}
	return implMap.get(trait.id) as T;
}

export function addTrait<T>(
	ctor: ValueConstructor,
	trait: Trait<T>,
	impl: T,
	replace = false
): void {
	if (!traitMap.has(ctor)) {
		traitMap.set(ctor, new Map());
	}
	const implMap = traitMap.get(ctor)!;

	if (implMap.has(trait.id) && !replace) {
		throw new Error(`Trait ${trait.id} is already defined for ${ctor.name}.`);
	}
	implMap.set(trait.id, impl);
}
