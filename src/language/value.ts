export interface Value {
	asString(): string;
	asBoolean(): boolean;
	asNumber(): number;
	isNone(): boolean;
}

export const None: Value = {
	asString: () => "None",
	asBoolean: () => false,
	asNumber: () => 0,
	isNone: () => true,
};
