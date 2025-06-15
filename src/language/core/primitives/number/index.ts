import { EqTrait, NotTrait, OrdTrait, type Eq } from "../../op.js";
import { implCoreArithmetic } from "../../utils.js";
import { BoolValueImpl } from "../bool/impl.js";
import { NumberValueImpl } from "./impl.js";
import { NumberValue } from "./number.js";
export * from "./number.js";

implCoreArithmetic(NumberValue);

NumberValue.addImpl(OrdTrait, NumberValueImpl).addImpl<Eq<NumberValue>>(
	EqTrait,
	NumberValueImpl
);
// inherit from boolean
NumberValue.addImpl(NotTrait, BoolValueImpl);
