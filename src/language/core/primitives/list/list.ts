import type { Arguments } from "../../../arguments.js";
import type { PropertyAccessorMap } from "../../op.js";
import { BaseValue, type Value } from "../../value.js";
import { Fn } from "../fn/index.js";
import { NumberValue } from "../number/number.js";
import { StringValue } from "../string/string.js";

export class List extends BaseValue {
	typeHint: string = "List";

	constructor(public readonly items: Value[]) {
		super();
	}

	join = new Fn((args: Arguments) => {
		const separator = args.get(0);
		return new StringValue(
			this.items.join(separator.isNone() ? "" : separator.asString())
		);
	}, "join");

	asString(): string {
		return `[${this.items.join(", ")}]`;
	}

	asBoolean(): boolean {
		return this.items.length > 0;
	}

	asNumber(): number {
		return this.items.length;
	}

	static override readonly props: PropertyAccessorMap<List> = {
		len: (me) => new NumberValue(me.items.length),
		join: (me) => me.join,
	};

	static override is(val: unknown): val is List {
		return val instanceof List;
	}
}
