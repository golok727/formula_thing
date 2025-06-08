import { BaseValue } from "../../language/core/value.js";

export class NumberValue extends BaseValue {
	readonly typeHint: string = "number";

	constructor(public value: number) {
		super();
	}

	asString(): string {
		return this.value.toString();
	}

	asBoolean(): boolean {
		return this.value !== 0;
	}

	asNumber(): number {
		return this.value;
	}

	isNone(): boolean {
		return false;
	}
}
