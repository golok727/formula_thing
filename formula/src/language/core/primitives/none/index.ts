import { implCoreArithmetic } from "../common.js";
import {
	EqTrait,
	NotTrait,
	PropertyAccessorTrait,
	OrdTrait,
	type Eq,
} from "../../op.js";
import { BoolValueImpl } from "../bool/impl.js";
import { NumberValueImpl } from "../number/impl.js";
import { NoneValueImpl } from "./impl.js";
import { NoneValue } from "./none.js";

export * from "./impl.js";
export * from "./none.js";

implCoreArithmetic(NoneValue);

NoneValue.addImpl<Eq<NoneValue>>(EqTrait, NoneValueImpl)
	.addImpl(NotTrait, BoolValueImpl)
	.addImpl(OrdTrait, NumberValueImpl)
	.addImpl(PropertyAccessorTrait, {
		getProperty(_, prop: string): NoneValue {
			throw new Error(`Cannot access property '${prop}' on None value.`);
		},
	});

export const None = new NoneValue();
