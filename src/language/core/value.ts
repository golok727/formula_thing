import { Arguments } from "../arguments.js";
import { OpAddTraitId } from "./op.js";
import { type Trait, type TraitDefinition } from "./trait.js";

export interface Value {
	// should be unique
	readonly typeHint: string;
	asString(): string;
	asBoolean(): boolean;
	asNumber(): number;
	isNone(): boolean;
}

export abstract class BaseValue implements Value {
	static traits: Map<string, Trait> = new Map();

	abstract typeHint: string;
	abstract asString(): string;
	abstract asBoolean(): boolean;
	abstract asNumber(): number;
	abstract isNone(): boolean;

	// add  this and other values together
	// only use this if this has a trait implementation or it will throw an error
	add(other: Value) {
		const trait = this.getImpl(OpAddTraitId);
		return trait.add(this, new Arguments([other]));
	}

	getImpl<T extends Trait = Trait>(trait: TraitDefinition<T>): T {
		const impl = (this.constructor as typeof BaseValue).traits.get(trait.id);
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
		const impl = (this.constructor as typeof BaseValue).traits.get(trait.id);
		if (!impl) {
			throw new Error(
				`Trait ${trait.id} is not implemented for ${this.typeHint}.`
			);
		}
		return access(this, impl as T);
	}

	static addImpl<V extends Value = Value, T = Trait<V>>(
		trait: TraitDefinition,
		impl: T,
		replace?: boolean
	) {
		if (this.traits.has(trait.id) && !replace) {
			throw new Error(`Trait ${trait.id} is already defined.`);
		}
		this.traits.set(trait.id, impl as never);
	}
}
