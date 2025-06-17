import type { Expr } from "../ast.js";
import { Parser } from "../parser/parse.js";
import type { Visit, Visitor } from "../visitor.ts";
import { Environment } from "./environment.js";
import { Instance } from "./instance.js";

export class CompilationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "CompilationError";
	}
}

export class Formula implements Visit {
	private _root: Expr | null = null;

	constructor(
		public readonly source: string,
		public readonly name: string = "Unnamed formula"
	) {}

	visit<Result = unknown>(visitor: Visitor<Result>): Result {
		if (!this._root) {
			throw new Error("Formula is not compiled.");
		}
		return this._root.visit(visitor);
	}

	isCompiled(): boolean {
		return this._root !== null;
	}

	/**
	 * Create an instance of the formula. Will throw an error if the formula is not compiled.
	 */
	createInstance(): Instance<Environment>;
	createInstance<Env extends Environment = Environment>(
		env: Env
	): Instance<Env>;
	createInstance(env?: Environment): Instance<Environment> {
		return new Instance(this, env ?? new Environment());
	}

	compile(): this {
		const errors = this.compileSafe()[1];
		if (errors) {
			console.error("Failed to compile formula:", this.name, "Errors:", errors);
			throw new Error(`Compilation failed for formula "${this.name}"`);
		}
		return this;
	}

	compileSafe():
		| [formula: Formula, error: null]
		| [formula: null, error: CompilationError] {
		const parser = new Parser(this.source);
		let [root, error] = parser.parse();
		if (error) {
			// todo - handle errors properly
			return [null, new CompilationError(`ParseError: ${error}`)];
		}
		this._root = root;
		return [this, null];
	}

	toString(pretty?: boolean): string {
		return this._root?.toString(pretty) ?? "<not compiled>";
	}
}
