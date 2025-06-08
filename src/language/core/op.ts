import { defineTrait, type Trait } from "./trait.js";
import type { Value } from "./value.js";

export type Add<T extends Value = Value> = {
	add(me: T, other: Value): Value;
};
export type Sub<T extends Value = Value> = {
	sub(me: T, other: Value): Value;
};
export type Mul<T extends Value = Value> = {
	mul(me: T, other: Value): Value;
};
export type Div<T extends Value = Value> = {
	div(me: T, other: Value): Value;
};

export const AddTrait = defineTrait<Add>("OpAddTrait");
export const SubTrait = defineTrait<Sub>("OpSubTrait");
export const MulTrait = defineTrait<Mul>("OpMulTrait");
export const DivTrait = defineTrait<Div>("OpDivTrait");
