import type { Arguments } from "../arguments.js";
import { defineTrait, type Trait } from "./trait.js";
import type { Value } from "./value.js";

export interface OpAdd<T extends Value = Value> extends Trait<T> {
	add(me: T, args: Arguments): Value;
}

export interface OpSub<T extends Value = Value> extends Trait<T> {
	sub(me: T, args: Arguments): Value;
}

export interface OpMul<T extends Value = Value> extends Trait<T> {
	mul(me: T, args: Arguments): Value;
}

export interface OpDiv<T extends Value = Value> extends Trait<T> {
	div(me: T, args: Arguments): Value;
}

export const OpAddTraitId = defineTrait<OpAdd>("OpAddTrait");
export const OpSubTraitId = defineTrait<OpSub>("OpSubTrait");
export const OpMulTraitId = defineTrait<OpMul>("OpMulTrait");
export const OpDivTraitId = defineTrait<OpDiv>("OpDivTrait");
