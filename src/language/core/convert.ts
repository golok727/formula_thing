import { defineTrait, type Trait } from "./trait.js";
import type { Value } from "./value.js";

export interface AsString<T extends Value = Value> extends Trait<T> {
	asString(me: T): string;
}

export interface AsBoolean<T extends Value = Value> extends Trait<T> {
	asBoolean(me: T): boolean;
}

export interface AsNumber<T extends Value = Value> extends Trait<T> {
	asNumber(me: T): number;
}

export const AsStringTrait = defineTrait<AsString>("AsStringTrait");
export const AsBooleanTrait = defineTrait<AsBoolean>("AsBooleanTrait");
export const AsNumberTrait = defineTrait<AsNumber>("AsNumberTrait");
