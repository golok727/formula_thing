import { BaseValue } from "../value.js";

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
}

export const None = new NoneValue();
