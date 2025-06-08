import { BaseValue } from "../value.js";

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
		const num = parseFloat(this.value);
		return isNaN(num) ? 0 : num;
	}

	isNone(): boolean {
		return false;
	}
}
