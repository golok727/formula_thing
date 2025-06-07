import { SAMPLE_FORMULA } from "../__mock.js";
import type { Expr } from "../ast.js";

export type CompilationResult =
	| [formula: Formula, errors: null]
	| [null, errors: string[]];

export class Formula {
	private _root: Expr | null = null;

	constructor(public readonly name: string, public readonly source: string) {}

	isCompiled(): boolean {
		return this._root !== null;
	}

	compile(): this {
		this._root = SAMPLE_FORMULA;
		return this;
	}

	compileSafe(): CompilationResult {
		this._root = SAMPLE_FORMULA;
		return [this, null];
	}

	toString(): string {
		return this._root?.toString() ?? "<not compiled>";
	}
}
