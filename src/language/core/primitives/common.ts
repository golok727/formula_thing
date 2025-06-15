import type { Add, Div, Mul, Neg, Rem, Sub } from "../op.js";
import type { Value } from "../value.js";
import { NumberValue } from "./number/number.js";

export type CoreArithmeticImplementations = Add & Sub & Mul & Div & Rem & Neg;
export const CoreArithmeticImpl: CoreArithmeticImplementations = {
	add(me: Value, other: Value): Value {
		return new NumberValue(me.asNumber() + other.asNumber());
	},

	sub(me: Value, other: Value): NumberValue {
		return new NumberValue(me.asNumber() - other.asNumber());
	},

	mul(me: Value, other: Value): NumberValue {
		return new NumberValue(me.asNumber() * other.asNumber());
	},

	div(me: Value, other: Value): NumberValue {
		return new NumberValue(me.asNumber() / other.asNumber());
	},

	rem(me: Value, other: Value): NumberValue {
		return new NumberValue(me.asNumber() % other.asNumber());
	},

	neg(me: Value): NumberValue {
		return new NumberValue(-me.asNumber());
	},
};
