import { BaseValue, type Value } from "../../value.js";
import { Fn } from "../fn/fn.js";

export class StringValue extends BaseValue {
	readonly typeHint: string = "String";

	get length(): number {
		return this.value.length;
	}

	readonly trim = new Fn(() => new StringValue(this.value.trim()));

	constructor(public readonly value: string) {
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

	static is(val: unknown): val is StringValue {
		return val instanceof StringValue;
	}
}
