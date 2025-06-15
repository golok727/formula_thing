import { BaseValue } from "../../value.js";

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

	not(): BooleanValue {
		return new BooleanValue(!this.value);
	}

	static is(val: unknown): val is BooleanValue {
		return val instanceof BooleanValue;
	}
}
