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
import { StringValue } from "./string.js";

export class BooleanValue extends BaseValue {
	readonly typeHint: string = "Boolean";

	constructor(public value: boolean) {
		super();
	}

	asString(): string {
		return this.value ? "true" : "false";
	}

	asBoolean(): boolean {
		return this.value;
	}

	asNumber(): number {
		return this.value ? 1 : 0;
	}

	isNone(): boolean {
		return false;
	}
}

BooleanValue.addImpl<Add<BooleanValue>>(AddTrait, {
	add: (me, other): Value => {
		if (other instanceof StringValue) {
			return StringValue.getImpl(AddTrait).add(me, other);
		}
		return NumberValue.getImpl(AddTrait).add(me, other);
	},
});

BooleanValue.addImpl<Sub<BooleanValue>>(SubTrait, {
	sub: (me, other): Value => {
		return NumberValue.getImpl(SubTrait).sub(me, other);
	},
});

BooleanValue.addImpl<Mul<BooleanValue>>(MulTrait, {
	mul: (me, other): Value => {
		return NumberValue.getImpl(MulTrait).mul(me, other);
	},
});

BooleanValue.addImpl<Div<BooleanValue>>(DivTrait, {
	div: (me, other): Value => {
		return NumberValue.getImpl(DivTrait).div(me, other);
	},
});
