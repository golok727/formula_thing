import { BaseValue, OpAddTraitId, type Value } from "../../language/index.js";

export class BooleanValue extends BaseValue {
	readonly typeHint: string = "boolean";

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
}

BooleanValue.addImpl<BooleanValue>(OpAddTraitId, {
	add: (me, args): Value => {
		throw new Error(
			"Boolean values do not support addition. Use logical operations instead."
		);
	},
});
