import { OpAdd, OpDiv, OpMul, OpSub, type OpAddTrait } from "../op.js";
import { BaseValue, type Value } from "../value.js";
import { NumberValue } from "./number.js";

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

BooleanValue.addImpl(OpAdd, {
	add: (me, other): Value => {
		return new NumberValue(me.asNumber() + other.asNumber());
	},
});

BooleanValue.addImpl(OpSub, {
	sub: (me, other): Value => {
		return new NumberValue(me.asNumber() - other.asNumber());
	},
});

BooleanValue.addImpl(OpMul, {
	mul: (me, other): Value => {
		return new NumberValue(me.asNumber() * other.asNumber());
	},
});

BooleanValue.addImpl(OpDiv, {
	div: (me, other): Value => {
		if (other.asNumber() === 0) {
			return new NumberValue(NaN);
		}
		return new NumberValue(me.asNumber() / other.asNumber());
	},
});
