import { Arguments } from "../../../arguments.js";
import { BaseValue, type Value } from "../../value.js";
import { None } from "../none/index.js";

export class Fn extends BaseValue {
	typeHint: string = "Fn";

	name: string = "anonymous";

	asString(): string {
		return `[Function: ${this.name}]`;
	}

	asBoolean(): boolean {
		return true;
	}
	asNumber(): number {
		return NaN;
	}

	isNone(): boolean {
		return false;
	}

	constructor(public readonly fn: (args: Arguments) => Value) {
		super();
	}

	call(args: Value[]): Value {
		return this.fn(new Arguments(args)) ?? None;
	}
}
