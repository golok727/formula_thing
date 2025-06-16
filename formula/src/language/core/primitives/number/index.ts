import { EqTrait, NotTrait, OrdTrait, type Eq } from "../../op.js";
import { implPropertyAccessor } from "../../utils.js";
import { BoolValueImpl } from "../bool/impl.js";
import { implCoreArithmetic } from "../common.js";
import { NumberValueImpl } from "./impl.js";
import { NumberValue } from "./number.js";
export * from "./number.js";

implCoreArithmetic(NumberValue);
implPropertyAccessor(NumberValue);

NumberValue.addImpl(OrdTrait, NumberValueImpl).addImpl<Eq<NumberValue>>(
	EqTrait,
	NumberValueImpl
);
// inherit from boolean
NumberValue.addImpl(NotTrait, BoolValueImpl);
