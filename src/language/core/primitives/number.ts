import {
	AddTrait,
	DivTrait,
	EqTrait,
	MulTrait,
	Ordering,
	OrdTrait,
	RemTrait,
	SubTrait,
	type Eq,
} from "../op.js";
import { BaseValue, type Value } from "../value.js";
import { StringValue } from "./string.js";

export class NumberValue extends BaseValue {
	readonly typeHint: string = "Number";

	constructor(public value: number) {
		super();
	}

	asString(): string {
		return this.value.toString();
	}

	asBoolean(): boolean {
		return !!this.value;
	}

	asNumber(): number {
		return this.value;
	}

	isNone(): boolean {
		return false;
	}

	static add(me: Value, other: Value): Value {
		return new NumberValue(me.asNumber() + other.asNumber());
	}

	static sub(me: Value, other: Value): NumberValue {
		return new NumberValue(me.asNumber() - other.asNumber());
	}

	static mul(me: Value, other: Value): NumberValue {
		return new NumberValue(me.asNumber() * other.asNumber());
	}

	static div(me: Value, other: Value): NumberValue {
		return new NumberValue(me.asNumber() / other.asNumber());
	}

	static rem(me: Value, other: Value): NumberValue {
		return new NumberValue(me.asNumber() % other.asNumber());
	}

	static cmp(me: Value, other: Value): Ordering {
		const a = me.asNumber();
		const b = other.asNumber();
		return a === b ? Ordering.Eq : a < b ? Ordering.Lt : Ordering.Gt;
	}

	static eq(me: NumberValue, other: Value): boolean {
		if (!NumberValue.is(other)) {
			throw new Error(
				`First parameter to NumberValue.eq must be a NumberValue but got ${other.typeHint}`
			);
		}
		return other instanceof NumberValue && me.value === other.value;
	}
}

NumberValue.addImpl(AddTrait, NumberValue);
NumberValue.addImpl(SubTrait, NumberValue);
NumberValue.addImpl(MulTrait, NumberValue);
NumberValue.addImpl(DivTrait, NumberValue);
NumberValue.addImpl(RemTrait, NumberValue);
NumberValue.addImpl(OrdTrait, NumberValue);
NumberValue.addImpl<Eq<NumberValue>>(EqTrait, NumberValue);
