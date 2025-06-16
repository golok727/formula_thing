import { AddTrait, EqTrait, NotTrait, OrdTrait, type Eq } from "../../op.js";
import { implPropertyAccessor } from "../../utils.js";
import { BoolValueImpl } from "../bool/impl.js";
import { implCoreArithmetic } from "../common.js";
import { StringValueImpl } from "./impl.js";
import { StringValue } from "./string.js";

export * from "./string.js";
export * from "./impl.js";

implCoreArithmetic(StringValue);

StringValue.addImpl(AddTrait, StringValueImpl, /* Replace*/ true)
	.addImpl(OrdTrait, StringValueImpl)
	.addImpl<Eq<StringValue>>(EqTrait, StringValueImpl);
// inherit from boolean
StringValue.addImpl(NotTrait, BoolValueImpl);

implPropertyAccessor(StringValue);
