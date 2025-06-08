import {
	CallExpr,
	EmptyExpr,
	Ident,
	LiteralExpr,
	MemberExpr,
	type Expr,
} from "../ast.js";
import { span } from "../span.js";
import { Lexer } from "./lexer.js";
import { Token, TokenKind } from "./token.js";

const src = `
 if(
		prop("Age") >= 18, 
		concat(prop("Name"), " is ", "Adult"), 
		concat(prop("Name"), " is ", "Minor")
 ) 
`.trim();

export class Parser {
	private tokens: Lexer;
	private t0: Token | null = null;
	private t1: Token | null = null;
	private errors: unknown[] = [];

	constructor(public readonly source: string) {
		this.tokens = new Lexer(source);
		this.t0 = this.tokens.next() ?? null;
		this.t1 = this.tokens.next() ?? null;
	}

	private _isEof(): boolean {
		return this.t0 === null;
	}

	private _nextToken(): Token | null {
		const cur = this.t0;
		const next = this.tokens.next();
		this.t0 = this.t1;
		this.t1 = next;
		return cur;
	}

	private _nextIs(kind: TokenKind): boolean {
		return this.t0?.kind === kind;
	}

	private _expectOne(kind: TokenKind): Token {
		if (this.t0?.kind === kind) {
			return this._nextToken()!;
		}
		throw new Error(
			`Expected token of kind '${kind}', but found '${
				this.t0?.kind ?? TokenKind.Eof
			}'`
		);
	}

	private _parseParenthesized<T>(parse: () => T): T {
		this._expectOne(TokenKind.LParen); // consume '('
		const expr = parse();
		this._expectOne(TokenKind.RParen); // consume ')'
		return expr;
	}

	private _parseFnCall(callee: Expr): Expr {
		const args = this._parseParenthesized(() => {
			return this._parseSeriesOf(() => {
				return this._parsePrimary();
			}, TokenKind.Comma);
		});
		const fn = new CallExpr(callee, args, span(0, 0));
		if (this._nextIs(TokenKind.Dot)) {
			return this._parseMemberExpr(fn);
		}
		return fn;
	}

	private _parseSeriesOf<T>(
		parse: () => T | null,
		delim: TokenKind | null
	): T[] {
		const items: T[] = [];
		while (true) {
			const item = parse();
			if (item === null) {
				break;
			}

			items.push(item);

			if (!delim) {
				continue;
			}
			if (this._nextIs(delim)) {
				this._nextToken(); // consume the delimiter
			} else {
				break;
			}
		}
		return items;
	}

	private _parseMemberExpr(referer: Expr): Expr {
		this._expectOne(TokenKind.Dot); // consume '.'
		if (!this._nextIs(TokenKind.Ident)) {
			throw new Error(
				`Expected an identifier after '.', but found '${
					this.t0?.kind ?? TokenKind.Eof
				}'`
			);
		}
		const token = this._nextToken()!; // consume the identifier
		let property = new Ident(token.source(this.source), token.span);
		let member = new MemberExpr(referer, property, token.span);
		if (this._nextIs(TokenKind.LParen)) {
			return this._parseFnCall(member);
		}
		// todo Lbracket for array access
		return member;
	}

	private _parseIdent(): Expr {
		const token = this._nextToken(); // consume the identifier
		if (!token || token.kind !== TokenKind.Ident) {
			throw new Error(
				`Expected an identifier, but found '${token?.kind ?? TokenKind.Eof}'`
			);
		}

		const name = token.source(this.source);
		const ident = new Ident(name, token.span);

		if (this._nextIs(TokenKind.LParen)) {
			return this._parseFnCall(ident);
		} else if (this._nextIs(TokenKind.Dot)) {
			return this._parseMemberExpr(ident);
		}
		return ident;
	}

	private _parsePrimary(): Expr | null {
		if (this.t0) {
			switch (this.t0.kind) {
				case TokenKind.Number: {
					const token = this._nextToken()!; // consume the literal
					const value = Number(token.source(this.source));
					if (isNaN(value)) {
						throw new Error(
							`Invalid number literal: ${token.source(this.source)}`
						);
					}
					return new LiteralExpr(value, token.span);
				}
				case TokenKind.String: {
					const token = this._nextToken()!; // consume the literal
					return new LiteralExpr(
						token.source(this.source).slice(1, -1), // remove quotes
						token.span
					);
				}
				case TokenKind.Boolean: {
					const token = this._nextToken()!; // consume the literal
					const value = token.source(this.source) === "true";
					return new LiteralExpr(value, token.span);
				}
				case TokenKind.Ident: {
					return this._parseIdent();
				}
				default:
					return null;
			}
		}
		return null;
	}

	private _parseImpl(): Expr {
		if (this._isEof()) {
			return new EmptyExpr(span(0, 0));
		}
		// todo loop
		const expr = this._parsePrimary();
		if (!expr) {
			throw new Error(
				`Unexpected token: ${this.t0?.kind ?? TokenKind.Eof} at position ${
					this.t0?.span.start
				}`
			);
		}

		return expr;
	}

	parse(): [result: Expr, errors: null] | [result: null, errors: Error[]] {
		let res: Expr | undefined;
		try {
			res = this._parseImpl();
			console.log(res.toString());
		} catch (error) {
			console.error(error);
			this.errors.push(error);
		}

		if (this.errors.length > 0) {
			return [null, this.errors as Error[]];
		}

		if (!res) {
			res = new EmptyExpr(span(0, 0));
		}
	}
}
