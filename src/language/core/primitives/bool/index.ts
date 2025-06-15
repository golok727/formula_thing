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
import { CoreArithmeticImpl } from "../common.js";
import { BooleanValue } from "./bool.js";
import { BoolValueImpl } from "./impl.js";
import { NumberValueImpl } from "../number/impl.js";
export * from "./bool.js";
export * from "./impl.js";

BooleanValue.addImpl<Eq<BooleanValue>>(EqTrait, BoolValueImpl)
	.addImpl(NotTrait, BoolValueImpl)
	.addImpl(AddTrait, CoreArithmeticImpl)
	.addImpl(SubTrait, CoreArithmeticImpl)
	.addImpl(MulTrait, CoreArithmeticImpl)
	.addImpl(DivTrait, CoreArithmeticImpl)
	.addImpl(RemTrait, CoreArithmeticImpl)
	.addImpl(NegTrait, CoreArithmeticImpl)
	.addImpl(OrdTrait, NumberValueImpl);
