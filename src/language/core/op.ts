import { defineTrait, type Trait } from "./trait.js";
import type { Value } from "./value.js";

export interface OpAddTrait<T extends Value = Value> extends Trait<T> {
	add(me: T, other: Value): Value;
}

export interface OpSubTrait<T extends Value = Value> extends Trait<T> {
	sub(me: T, other: Value): Value;
}

export interface OpMulTrait<T extends Value = Value> extends Trait<T> {
	mul(me: T, other: Value): Value;
}

export interface OpDivTrait<T extends Value = Value> extends Trait<T> {
	div(me: T, other: Value): Value;
}

export const OpAdd = defineTrait<OpAddTrait>("OpAddTrait");
export const OpSub = defineTrait<OpSubTrait>("OpSubTrait");
export const OpMul = defineTrait<OpMulTrait>("OpMulTrait");
export const OpDiv = defineTrait<OpDivTrait>("OpDivTrait");
