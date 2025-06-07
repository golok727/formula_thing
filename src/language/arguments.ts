import { None, type Value } from "./value.js";

export class Arguments {
	constructor(private readonly args: Value[]) {}

	get(index: number): Value {
		if (index < 0 || index >= this.args.length) {
			throw new Error(`Argument index ${index} out of bounds`);
		}
		return this.args[index] || None;
	}
}
