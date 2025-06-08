import { Formula } from "./language/formula.js";
import { StringValue } from "./language/index.js";
import { FormulaRuntime } from "./runtime.js";

import readline from "node:readline/promises";

const runtime = new FormulaRuntime();
runtime.define({
	type: "function",
	description: "Get the current time",
	linkname: "now",
	fn: () => {
		return new StringValue(new Date().toISOString());
	},
});

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: true,
});

while (true) {
	const input = await rl.question("> ");
	if (input.trim() === ".exit") break;
	if (!input.trim()) continue;

	try {
		const formula = new Formula("input", input).compile();
		const instance = runtime.createInstance(formula);
		const result = instance.eval();
		console.log(result.asString());
	} catch (err) {
		console.error("Error:", err);
	}
}

rl.close();
