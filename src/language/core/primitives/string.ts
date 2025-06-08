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
import { NumberValue } from "./number.js";

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
}

StringValue.addImpl<Add<StringValue>>(AddTrait, {
	add: (me, other): StringValue => {
		return new StringValue(me.asString() + other.asString());
	},
});

StringValue.addImpl<Sub<StringValue>>(SubTrait, {
	sub: (me, other): Value => {
		return NumberValue.getImpl(SubTrait).sub(me, other);
	},
});

StringValue.addImpl<Mul<StringValue>>(MulTrait, {
	mul: (me, other): Value => {
		return NumberValue.getImpl(MulTrait).mul(me, other);
	},
});

StringValue.addImpl<Div<StringValue>>(DivTrait, {
	div: (me, other): Value => {
		return NumberValue.getImpl(DivTrait).div(me, other);
	},
});
