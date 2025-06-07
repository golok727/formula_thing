export interface Value {
	typeHint: string;
	asString(): string;
	asBoolean(): boolean;
	asNumber(): number;
	isNone(): boolean;
}

export const None: Value = {
	typeHint: "None",
	asString: () => "None",
	asBoolean: () => false,
	asNumber: () => 0,
	isNone: () => true,
};

export class BooleanValue implements Value {
	typeHint: string = "boolean";

	constructor(public value: boolean) {}

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
}
export class NumberValue implements Value {
	typeHint: string = "number";

	constructor(public value: number) {}

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
export class StringValue implements Value {
	typeHint: string = "string";

	constructor(public value: string) {}

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
