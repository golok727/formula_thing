import type { BooleanValue } from "./primitives/bool.js";
import { defineTrait } from "./trait.js";
import type { Value } from "./value.js";

export const Ordering = {
	Lt: -1,
	Eq: 0,
	Gt: 1,
} as const;

export type Ordering = (typeof Ordering)[keyof typeof Ordering];

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
export type Rem<T extends Value = Value> = {
	rem(me: T, other: Value): Value;
};
export type Ord<T extends Value = Value> = {
	cmp(me: T, other: Value): Ordering;
};
export type Eq<T extends Value = Value> = {
	eq(me: T, other: Value): BooleanValue;
};
export type Neg<T extends Value = Value> = {
	neg(me: T): T;
};
export type Not<T extends Value = Value> = {
	not(me: T): BooleanValue;
};

export const AddTrait = defineTrait<Add>("_core_AddTrait");
export const SubTrait = defineTrait<Sub>("_core_SubTrait");
export const MulTrait = defineTrait<Mul>("_core_MulTrait");
export const DivTrait = defineTrait<Div>("_core_DivTrait");
export const RemTrait = defineTrait<Rem>("_core_RemTrait");
export const OrdTrait = defineTrait<Ord>("_core_OrdTrait");
export const EqTrait = defineTrait<Eq>("_core_EqTrait");
export const NegTrait = defineTrait<Neg>("_core_NegTrait");
export const NotTrait = defineTrait<Not>("_core_NotTrait");
