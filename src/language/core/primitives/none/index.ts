import {
	AddTrait,
	DivTrait,
	EqTrait,
	MulTrait,
	NegTrait,
	NotTrait,
	OrdTrait,
	RemTrait,
	SubTrait,
	type Eq,
} from "../../op.js";
import { BoolValueImpl } from "../bool/impl.js";
import { CoreArithmeticImpl } from "../common.js";
import { NumberValueImpl } from "../number/impl.js";
import { NoneValueImpl } from "./impl.js";
import { NoneValue } from "./none.js";

export * from "./none.js";
export * from "./impl.js";

NoneValue.addImpl<Eq<NoneValue>>(EqTrait, NoneValueImpl)
	.addImpl(NotTrait, BoolValueImpl)
	.addImpl(AddTrait, CoreArithmeticImpl)
	.addImpl(SubTrait, CoreArithmeticImpl)
	.addImpl(MulTrait, CoreArithmeticImpl)
	.addImpl(DivTrait, CoreArithmeticImpl)
	.addImpl(RemTrait, CoreArithmeticImpl)
	.addImpl(OrdTrait, NumberValueImpl)
	.addImpl(NegTrait, BoolValueImpl);

export const None = new NoneValue();
