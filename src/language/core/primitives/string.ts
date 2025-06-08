import { AddTrait, SubTrait, type Add, type Sub } from "../op.js";
import { BaseValue, type Value } from "../value.js";

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
		return parseFloat(this.value);
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
		return other.getImpl(SubTrait).sub(me, other);
	},
});
