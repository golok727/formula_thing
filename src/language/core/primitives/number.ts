import {
	AddTrait,
	DivTrait,
	MulTrait,
	SubTrait,
	type Add,
	type Div,
	type Mul,
	type Sub,
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
		return !this.value;
	}

	asNumber(): number {
		return this.value;
	}

	isNone(): boolean {
		return false;
	}
}

NumberValue.addImpl<Add<NumberValue>>(AddTrait, {
	add: (me, other): Value => {
		if (other instanceof StringValue) {
			return StringValue.getImpl(AddTrait).add(me, other);
		}

		return new NumberValue(me.asNumber() + other.asNumber());
	},
});

NumberValue.addImpl<Sub<NumberValue>>(SubTrait, {
	sub: (me, other): NumberValue => {
		return new NumberValue(me.asNumber() - other.asNumber());
	},
});

NumberValue.addImpl<Mul<NumberValue>>(MulTrait, {
	mul: (me, other): NumberValue => {
		return new NumberValue(me.asNumber() * other.asNumber());
	},
});

NumberValue.addImpl<Div<NumberValue>>(DivTrait, {
	div: (me, other): NumberValue => {
		return new NumberValue(me.asNumber() / other.asNumber());
	},
});
