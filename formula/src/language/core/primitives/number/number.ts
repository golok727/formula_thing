import type { PropertyAccessorMap } from "../../op.js";
import { BaseValue } from "../../value.js";

export class NumberValue extends BaseValue {
	readonly typeHint: string = "Number";

	constructor(public readonly value: number) {
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

	static override readonly properties: PropertyAccessorMap<NumberValue> = {
		floor: (me: NumberValue) => new NumberValue(Math.floor(me.value)),
	};
}
