import { EqTrait, NotTrait, OrdTrait, type Eq } from "../../op.js";
import { BooleanValue } from "./bool.js";
import { BoolValueImpl } from "./impl.js";
import { NumberValueImpl } from "../number/impl.js";
import { implCoreArithmetic } from "../../utils.js";
export * from "./bool.js";
export * from "./impl.js";

BooleanValue.addImpl<Eq<BooleanValue>>(EqTrait, BoolValueImpl)
	.addImpl(NotTrait, BoolValueImpl)
	.addImpl(OrdTrait, NumberValueImpl);

implCoreArithmetic(BooleanValue);
