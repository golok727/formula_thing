import { Formula } from "./language/formula.js";
import {
	BaseValue,
	Environment,
	Fn,
	implPropertyAccessor,
	None,
	NumberValue,
	StringValue,
	type PropertyAccessorMap,
	type Value,
} from "./language/index.js";
import { FormulaRuntime } from "./std/runtime.js";

import readline from "node:readline/promises";

let running = true;

export class Thing extends BaseValue {
	typeHint: string = "Thing";

	constructor(public value = 69, public next: Value = None) {
		super();
	}

	readonly magic = new Fn(
		() => new StringValue(`Magic! ${this.value}`),
		"magic"
	);

	asString(): string {
		return "This is a Thing";
	}
	asBoolean(): boolean {
		return true;
	}
	asNumber(): number {
		return this.value;
	}
	isNone(): boolean {
		return false;
	}

	static override readonly props: PropertyAccessorMap<Thing> = {
		next: (me) => me.next,
		value: (me) => new NumberValue(me.value),
		magic: (me) => me.magic,
	};
}

implPropertyAccessor(Thing);

const runtime = new FormulaRuntime();
runtime.define({
	type: "value",
	linkName: "thing",
	description: "A sample Thing object",
	value: new Thing(69, new Thing(420, new Thing(666))),
});

runtime.define({
	type: "function",
	linkname: "let",
	fn: (env, args) => {
		const defName = args.get(0).asString();
		const value = args.get(1);

		env.define({
			type: "value",
			linkName: defName,
			override: true,
			value: value,
		});

		return value;
	},
});
runtime.define({
	type: "function",
	description: "Get the current time",
	linkname: "now",
	fn: () => {
		return new StringValue(new Date().toISOString());
	},
});
runtime.define({
	type: "function",
	description: "Exit the REPL",
	linkname: "exit",
	fn: () => {
		running = false;
		return new StringValue("Exiting REPL...");
	},
});

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: true,
});

while (running) {
	const input = await rl.question("> ");
	if (input.trim() === ".exit") break;
	if (!input.trim()) continue;

	try {
		let res = evaluateFormula(input, runtime);
		console.log(`(${res.typeHint}): `, res.asString());
	} catch (err) {
		console.error("Error:", err);
	}
}

rl.close();

export function evaluateFormula(
	source: string,
	env: Environment = new FormulaRuntime()
): Value {
	const formula = new Formula(source, "Eval").compile();
	const instance = env.createInstance(formula);
	return instance.eval();
}
