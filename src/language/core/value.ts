import { Arguments } from "../arguments.js";
import { OpAdd, OpSub, type OpAddTrait } from "./op.js";
import {
	type ExtractTrait,
	type Trait,
	type TraitDefinition,
} from "./trait.js";

export interface Value {
	// should be unique
	readonly typeHint: string;
	asString(): string;
	asBoolean(): boolean;
	asNumber(): number;
	isNone(): boolean;

	getImpl<T extends Trait = Trait>(trait: TraitDefinition<T>): T;
}

export abstract class BaseValue implements Value {
	protected static traitMap: Map<string, Trait> = new Map();

	abstract typeHint: string;
	abstract asString(): string;
	abstract asBoolean(): boolean;
	abstract asNumber(): number;
	abstract isNone(): boolean;

	// add  this and other values together
	// only use this if this has a trait implementation or it will throw an error

	getImpl<T extends Trait = Trait>(trait: TraitDefinition<T>): T {
		const impl = (this.constructor as typeof BaseValue).traitMap.get(trait.id);
		if (!impl) {
			throw new Error(
				`Trait ${trait.id} is not implemented for ${this.typeHint}.`
			);
		}
		return impl as T;
	}

	useImpl<R, T extends Trait = Trait>(
		trait: TraitDefinition<T>,
		access: (value: this, trait: T) => R
	) {
		const impl = (this.constructor as typeof BaseValue).traitMap.get(trait.id);
		if (!impl) {
			throw new Error(
				`Trait ${trait.id} is not implemented for ${this.typeHint}.`
			);
		}
		return access(this, impl as T);
	}

	static addImpl<T extends TraitDefinition<any>>(
		trait: T,
		impl: ExtractTrait<T>,
		replace?: boolean
	) {
		if (this.traitMap.has(trait.id) && !replace) {
			throw new Error(`Trait ${trait.id} is already defined.`);
		}
		this.traitMap.set(trait.id, impl as never);
	}
}

type thing = ExtractTrait<TraitDefinition<OpAddTrait>>;
