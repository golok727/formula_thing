import { BaseValue } from "../../value.js";

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

	static is(val: unknown): val is NumberValue {
		return val instanceof NumberValue;
	}
}
