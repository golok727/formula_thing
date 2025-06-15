import { None, type Value } from "./core/index.js";

export class Arguments {
	constructor(public readonly args: Value[]) {}

	get length(): number {
		return this.args.length;
	}

	get(index: number): Value {
		return this.args[index] ?? None;
	}
}
