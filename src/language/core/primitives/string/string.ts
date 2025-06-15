import { BaseValue, type Value } from "../../value.js";

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

	static is(val: unknown): val is StringValue {
		return val instanceof StringValue;
	}
}
