import { None, type Value } from "./core/index.js";

export class Arguments {
	constructor(public readonly args: Value[]) {}

	get length(): number {
		return this.args.length;
	}

	get(index: number): Value {
		if (index < 0 || index >= this.args.length) {
			return None;
		}
		return this.args[index] || None;
	}
}
