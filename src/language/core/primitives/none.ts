import { BaseValue, type Value } from "../value.js";
import { BooleanValue } from "./index.js";

export class NoneValue extends BaseValue {
	readonly typeHint: string = "None";
	constructor() {
		super();
	}

	asString(): string {
		return "None";
	}

	asBoolean(): boolean {
		return false;
	}

	asNumber(): number {
		return 0;
	}

	isNone(): boolean {
		return true;
	}

	static eq(me: NoneValue, other: Value): BooleanValue {
		if (!(me instanceof NoneValue)) {
			throw new Error(
				`First parameter to BooleanValue.eq must be a BooleanValue but got ${other.typeHint}`
			);
		}

		return new BooleanValue(other instanceof NoneValue);
	}

	static is(val: unknown): val is NoneValue {
		return val instanceof NoneValue;
	}
}

export const None = new NoneValue();
