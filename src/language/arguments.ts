import { None, type Value } from "./core/index.js";

export class Arguments {
	constructor(public readonly raw: Value[]) {}

	get length(): number {
		return this.raw.length;
	}

	get(index: number): Value {
		return this.raw[index] ?? None;
	}
}
