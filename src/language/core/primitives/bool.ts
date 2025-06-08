import {
	AddTrait,
	DivTrait,
	EqTrait,
	MulTrait,
	OrdTrait,
	RemTrait,
	SubTrait,
	type Eq,
} from "../op.js";
import { BaseValue, type Value } from "../value.js";
import { NumberValue } from "./number.js";

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

	static eq(me: BooleanValue, other: Value): boolean {
		if (!BooleanValue.is(other)) {
			throw new Error(
				`First parameter to BooleanValue.eq must be a BooleanValue but got ${other.typeHint}`
			);
		}
		return other instanceof BooleanValue && me.value === other.value;
	}
}

BooleanValue.addImpl(AddTrait, NumberValue);
BooleanValue.addImpl(SubTrait, NumberValue);
BooleanValue.addImpl(MulTrait, NumberValue);
BooleanValue.addImpl(DivTrait, NumberValue);
BooleanValue.addImpl(RemTrait, NumberValue);
BooleanValue.addImpl(OrdTrait, NumberValue);
BooleanValue.addImpl<Eq<BooleanValue>>(EqTrait, BooleanValue);
