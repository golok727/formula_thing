import { None, type Value } from "./core/index.js";

export class Arguments {
	constructor(public readonly raw: Value[]) {}

	get length(): number {
		return this.raw.length;
	}

	getOr(index: number, defaultValue: () => Value): Value {
		return this.raw[index] ?? defaultValue();
	}

	get(index: number): Value {
		return this.raw[index] ?? None;
	}
}
