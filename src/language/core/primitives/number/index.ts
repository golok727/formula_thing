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
import { NumberValueImpl } from "./impl.js";
import { NumberValue } from "./number.js";
export * from "./number.js";

NumberValue.addImpl(AddTrait, CoreArithmeticImpl)
	.addImpl(SubTrait, CoreArithmeticImpl)
	.addImpl(MulTrait, CoreArithmeticImpl)
	.addImpl(DivTrait, CoreArithmeticImpl)
	.addImpl(RemTrait, CoreArithmeticImpl)
	.addImpl(NegTrait, CoreArithmeticImpl)
	.addImpl(OrdTrait, NumberValueImpl)
	.addImpl<Eq<NumberValue>>(EqTrait, NumberValueImpl);
// inherit from boolean
NumberValue.addImpl(NotTrait, BoolValueImpl);
