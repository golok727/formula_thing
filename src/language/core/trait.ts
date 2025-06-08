import type { Arguments, Value } from "../index.js";

export type TraitDefinition<T extends Trait = Trait> = {
	readonly id: string;
	_marker?: T;
};

export function defineTrait<T extends Trait>(id: string): TraitDefinition<T> {
	return { id, _marker: undefined as never };
}

export interface Trait<T extends Value = Value> {
	[key: string]: (me: T, args: Arguments) => any;
}
