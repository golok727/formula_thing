import { SAMPLE_FORMULA } from "../__mock.js";
import type { Expr } from "../ast.js";
import type { Visit, Visitor } from "../visitor.ts";

export type CompilationResult =
	| [formula: Formula, errors: null]
	| [null, errors: string[]];

export class Formula implements Visit {
	private _root: Expr | null = null;

	constructor(public readonly name: string, public readonly source: string) {}

	visit<Result = unknown>(visitor: Visitor<Result>): Result {
		if (!this._root) {
			throw new Error("Formula is not compiled.");
		}
		return this._root.visit(visitor);
	}

	isCompiled(): boolean {
		return this._root !== null;
	}

	compile(): this {
		const errors = this.compileSafe()[1];
		if (errors) {
			throw new Error(`Compilation failed: ${errors.join(", ")}`);
		}
		return this;
	}

	compileSafe(): CompilationResult {
		// todo parse the source code here
		this._root = SAMPLE_FORMULA;
		return [this, null];
	}

	toString(): string {
		return this._root?.toString() ?? "<not compiled>";
	}
}
