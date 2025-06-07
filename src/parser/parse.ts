import type { Expr } from "../ast.js";
import { Lexer } from "./lexer.js";

export class Parser {
	private tokens: Lexer;
	private errors: unknown[] = [];

	constructor(public readonly source: string) {
		this.tokens = new Lexer(source);
	}

	parse(): [result: Expr, errors: null] | [result: null, errors: Error[]] {
		if (this.errors.length > 0) {
			return [null, this.errors as Error[]];
		}

		throw "Parser not implemented yet";
	}
}
