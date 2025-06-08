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

export class NumberValue extends BaseValue {
	readonly typeHint: string = "Number";

	constructor(public value: number) {
		super();
	}

	asString(): string {
		return this.value.toString();
	}

	asBoolean(): boolean {
		return this.value !== 0;
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
		if (other instanceof NumberValue) {
			return new NumberValue(me.value + other.value);
		}
		return other.getImpl(AddTrait).add(me, other);
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
		return new NumberValue(me.asNumber() + other.asNumber());
	},
});
