import type { PropertyAccessorMap } from "../../op.js";
import { BaseValue } from "../../value.js";
import { Fn } from "../fn/fn.js";

export class BooleanValue extends BaseValue {
	readonly typeHint: string = "Boolean";

	readonly then = new Fn((args) => {
		return this.value ? args.get(0) : args.get(1);
	});

	constructor(public readonly value: boolean) {
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

	not(): BooleanValue {
		return new BooleanValue(!this.value);
	}

	static is(val: unknown): val is BooleanValue {
		return val instanceof BooleanValue;
	}

	static override readonly properties: PropertyAccessorMap<BooleanValue> = {
		then: (me: BooleanValue) => me.then,
	};
}
