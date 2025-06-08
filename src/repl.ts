import { Formula } from "./language/formula.js";
import { Environment, StringValue, type Value } from "./language/index.js";
import { FormulaRuntime } from "./runtime.js";

import readline from "node:readline/promises";

let running = true;
const runtime = new FormulaRuntime();
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
		console.log(res.asString());
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
