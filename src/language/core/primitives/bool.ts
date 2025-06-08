import { OpAddTraitId } from "../op.js";
import { BaseValue, type Value } from "../value.js";

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
