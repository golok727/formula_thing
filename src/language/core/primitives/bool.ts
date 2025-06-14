import { BaseValue, type Value } from "../value.js";

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

	static eq(me: BooleanValue, other: Value): BooleanValue {
		if (!(me instanceof BooleanValue)) {
			throw new Error(
				`First parameter to BooleanValue.eq must be a BooleanValue but got ${other.typeHint}`
			);
		}

		return new BooleanValue(
			other instanceof BooleanValue && me.value === other.value
		);
	}

	static not(me: Value): BooleanValue {
		return new BooleanValue(!me.asBoolean());
	}

	static is(val: unknown): val is BooleanValue {
		return val instanceof BooleanValue;
	}
}
