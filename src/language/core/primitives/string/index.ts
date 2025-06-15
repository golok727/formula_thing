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
import { StringValueImpl } from "./impl.js";
import { StringValue } from "./string.js";

export * from "./string.js";

StringValue.addImpl(AddTrait, StringValueImpl)
	.addImpl(OrdTrait, StringValueImpl)
	.addImpl<Eq<StringValue>>(EqTrait, StringValueImpl);

StringValue.addImpl(SubTrait, CoreArithmeticImpl)
	.addImpl(MulTrait, CoreArithmeticImpl)
	.addImpl(DivTrait, CoreArithmeticImpl)
	.addImpl(RemTrait, CoreArithmeticImpl)
	.addImpl(NegTrait, CoreArithmeticImpl);

// inherit from boolean
StringValue.addImpl(NotTrait, BoolValueImpl);
