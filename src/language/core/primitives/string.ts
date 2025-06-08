import {
	AddTrait,
	DivTrait,
	EqTrait,
	MulTrait,
	NegTrait,
	NotTrait,
	Ordering,
	OrdTrait,
	RemTrait,
	SubTrait,
	type Eq,
} from "../op.js";
import { BaseValue, type Value } from "../value.js";
import { BooleanValue } from "./index.js";
import { NumberValue } from "./index.js";

export class StringValue extends BaseValue {
	readonly typeHint: string = "String";

	constructor(public value: string) {
		super();
	}

	asString(): string {
		return this.value;
	}

	asBoolean(): boolean {
		return this.value.length > 0;
	}

	asNumber(): number {
		return Number(this.value);
	}

	isNone(): boolean {
		return false;
	}

	static add(me: Value, other: Value): StringValue {
		return new StringValue(me.asString() + other.asString());
	}

	static cmp(me: Value, other: Value): Ordering {
		if (me instanceof StringValue && other instanceof StringValue) {
			const a = me.asString();
			const b = other.asString();
			return a === b ? Ordering.Eq : a < b ? Ordering.Lt : Ordering.Gt;
		}
		return NumberValue.cmp(me, other);
	}

	static eq(me: StringValue, other: Value): BooleanValue {
		if (!(me instanceof StringValue)) {
			throw new Error(
				`First parameter to StringValue.eq must be a StringValue but got ${other.typeHint}`
			);
		}
		return new BooleanValue(
			other instanceof StringValue && me.value === other.value
		);
	}
}
