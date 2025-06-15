import { Arguments } from "../../../arguments.js";
import { BaseValue, type Value } from "../../value.js";
import { None } from "../none/index.js";

export class Fn extends BaseValue {
	typeHint: string = "Fn";

	asString(): string {
		return `[Function: ${this.name}]`;
	}

	asBoolean(): boolean {
		return true;
	}
	asNumber(): number {
		return NaN;
	}

	constructor(
		public readonly fn: (args: Arguments) => Value,
		public readonly name = "anonymous"
	) {
		super();
	}

	call(args: Value[]): Value {
		return this.fn(new Arguments(args)) ?? None;
	}

	static override is(val: unknown): val is Fn {
		return val instanceof Fn;
	}
}
