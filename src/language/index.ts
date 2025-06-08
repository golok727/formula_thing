import {
	AddTrait,
	BooleanValue,
	DivTrait,
	EqTrait,
	MulTrait,
	NegTrait,
	NoneValue,
	NotTrait,
	NumberValue,
	OrdTrait,
	RemTrait,
	StringValue,
	SubTrait,
	type Eq,
} from "./core/index.js";

export * from "./instance.js";
export * from "./environment.js";
export * from "./types.js";
export * from "./formula.js";
export * from "./arguments.js";
export * from "./core/index.js";

effects();
function effects() {
	StringValue.addImpl(AddTrait, StringValue)
		.addImpl(OrdTrait, StringValue)
		.addImpl<Eq<StringValue>>(EqTrait, StringValue);

	// inherit from NumberValue for all other
	StringValue.addImpl(SubTrait, NumberValue)
		.addImpl(MulTrait, NumberValue)
		.addImpl(DivTrait, NumberValue)
		.addImpl(RemTrait, NumberValue)
		.addImpl(NegTrait, NumberValue);

	// inherit from boolean
	StringValue.addImpl(NotTrait, BooleanValue);

	NumberValue.addImpl(AddTrait, NumberValue)
		.addImpl(SubTrait, NumberValue)
		.addImpl(MulTrait, NumberValue)
		.addImpl(DivTrait, NumberValue)
		.addImpl(RemTrait, NumberValue)
		.addImpl(OrdTrait, NumberValue)
		.addImpl(NegTrait, NumberValue)
		.addImpl<Eq<NumberValue>>(EqTrait, NumberValue);
	// inherit from boolean
	NumberValue.addImpl(NotTrait, BooleanValue);

	BooleanValue.addImpl<Eq<BooleanValue>>(EqTrait, BooleanValue).addImpl(
		NotTrait,
		BooleanValue
	);

	// inherit from NumberValue for arithmetic operations
	BooleanValue.addImpl(AddTrait, NumberValue)
		.addImpl(SubTrait, NumberValue)
		.addImpl(MulTrait, NumberValue)
		.addImpl(DivTrait, NumberValue)
		.addImpl(RemTrait, NumberValue)
		.addImpl(OrdTrait, NumberValue)
		.addImpl(NegTrait, NumberValue);

	NoneValue.addImpl<Eq<NoneValue>>(EqTrait, NoneValue)
		.addImpl(NotTrait, BooleanValue)
		.addImpl(AddTrait, NumberValue)
		.addImpl(SubTrait, NumberValue)
		.addImpl(MulTrait, NumberValue)
		.addImpl(DivTrait, NumberValue)
		.addImpl(RemTrait, NumberValue)
		.addImpl(OrdTrait, NumberValue)
		.addImpl(NegTrait, NumberValue);
}
