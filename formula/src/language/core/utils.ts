import {
	AddTrait,
	DivTrait,
	MulTrait,
	NegTrait,
	PropertyAccessorTrait,
	RemTrait,
	SubTrait,
	type PropertyAccessor,
} from "./op.js";
import { CoreArithmeticImpl, None } from "./primitives/index.js";

import { addImpl, type ValueConstructor } from "./trait.js";
import type { Value } from "./value.js";

export function implPropertyAccessor<C extends ValueConstructor>(cstr: C) {
	addImpl(cstr, PropertyAccessorTrait, {
		getProperty(me: Value, prop: string): Value {
			const get = cstr.properties[prop];
			if (get) {
				return get(me as InstanceType<C>);
			}
			return None;
		},
	} satisfies PropertyAccessor);
}

export function implCoreArithmetic<C extends ValueConstructor>(cstr: C) {
	addImpl(cstr, AddTrait, CoreArithmeticImpl);
	addImpl(cstr, SubTrait, CoreArithmeticImpl);
	addImpl(cstr, MulTrait, CoreArithmeticImpl);
	addImpl(cstr, DivTrait, CoreArithmeticImpl);
	addImpl(cstr, RemTrait, CoreArithmeticImpl);
	addImpl(cstr, NegTrait, CoreArithmeticImpl);
}
