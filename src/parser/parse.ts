import {
	BinaryExpr,
	binaryOpFromTokenKind,
	CallExpr,
	EmptyExpr,
	getOpPrecedence,
	Ident,
	LiteralExpr,
	MemberExpr,
	UnaryExpr,
	UnaryOp,
	type Expr,
} from "../ast.js";
import { span } from "../span.js";
import { Lexer } from "./lexer.js";
import { Token, TokenKind } from "./token.js";

export class Parser {
	private tokens: Lexer;
	private t0: Token | null = null;
	private t1: Token | null = null;

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
			let argsList = this._parseSeriesOf(() => {
				return this._parseExpr();
			}, TokenKind.Comma);
			return argsList;
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

	private _parseIdent(): Ident {
		const token = this._nextToken(); // consume the identifier
		if (!token || token.kind !== TokenKind.Ident) {
			throw new Error(
				`Expected an identifier, but found '${token?.kind ?? TokenKind.Eof}'`
			);
		}

		const name = token.source(this.source);
		return new Ident(name, token.span);
	}

	// Parse a single unit of expression
	private _parseExprUnit(): Expr | null {
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
				case TokenKind.Ident: {
					const ident = this._parseIdent();

					if (this._nextIs(TokenKind.LParen)) {
						return this._parseFnCall(ident);
					} else if (this._nextIs(TokenKind.Dot)) {
						return this._parseMemberExpr(ident);
					}

					return ident;
				}
				case TokenKind.Boolean: {
					const token = this._nextToken()!; // consume the literal
					const value = token.source(this.source) === "true";
					return new LiteralExpr(value, token.span);
				}
				case TokenKind.LParen: {
					return this._parseParenthesized(() => {
						const expr = this._parseExpr();
						if (!expr) {
							throw new Error(`Expected an expression inside parentheses.'`);
						}
						return expr;
					});
				}
				case TokenKind.Not: {
					const not = this._nextToken()!; // consume 'not'
					const expr = this._parseExprUnit();
					if (!expr) {
						throw new Error(
							`Expected an expression after '${not.source(this.source)}'.`
						);
					}
					return new UnaryExpr(UnaryOp.Not, expr, not.span);
				}
				case TokenKind.Minus: {
					const minus = this._nextToken()!; // consume '-'
					const expr = this._parseExprUnit();
					if (!expr) {
						throw new Error(
							`Expected an expression after '${minus.source(this.source)}'.`
						);
					}
					return new UnaryExpr(UnaryOp.Negate, expr, minus.span);
				}
				default:
					return null;
			}
		}
		return null;
	}

	private getOpPrecedence(kind: TokenKind | null) {
		if (!kind) return null;
		const op = binaryOpFromTokenKind(kind);
		if (!op) return null;
		return getOpPrecedence(op);
	}

	private _parseExpr(): Expr | null {
		if (this._isEof()) {
			return null;
		}

		const exprStack: Expr[] = [];
		const opStack: OpWithPrecedence[] = [];

		for (;;) {
			const exprUnit = this._parseExprUnit();

			if (exprUnit !== null) {
				exprStack.push(exprUnit);
			} else if (exprStack.length === 0) {
				return null;
			} else {
				throw new Error("Op naked right");
			}

			const mayBeOp = this.t0;
			const precedence = this.getOpPrecedence(mayBeOp?.kind ?? null);

			if (precedence !== null) {
				this._nextToken(); // consume the operator token
				handleOp(
					{
						token:
							mayBeOp! /* getOpPrecedence will return null if token is null */,
						precedence,
					},
					opStack,
					exprStack,
					opExprReducer
				);
			} else {
				break;
			}
		}

		const expr = handleOp(null, opStack, exprStack, opExprReducer);
		return expr;
	}

	parse(): [result: Expr, error: null] | [result: null, error: unknown] {
		try {
			const res = this._parseExpr();
			return [res ?? new EmptyExpr(span(0, 0)), null];
		} catch (error) {
			console.error(error);
			return [null, error];
		}
	}
}

type OpWithPrecedence = { token: Token; precedence: number };

function handleOp(
	nextOp: OpWithPrecedence | null,
	opStack: OpWithPrecedence[],
	exprStack: Expr[],
	reducer: (op: Token, exprStack: Expr[]) => void
): Expr | null {
	let nxtOp = nextOp;

	for (;;) {
		const op = opStack.pop();
		if (!op && !nxtOp) {
			// if we don't have any operators left return the final expr
			const expr = exprStack.pop();

			if (!expr) return null;

			if (exprStack.length === 0) return expr;

			throw new Error(
				"@@internal Expression not fully reduced for some reason"
			);
		}

		if (!op && nxtOp) {
			opStack.push(nxtOp);
			break;
		}

		if (op && !nxtOp) {
			reducer(op.token, exprStack);
		} else if (op && nxtOp) {
			const { token: opl, precedence: pl } = op;
			const { token: opr, precedence: pr } = nxtOp;
			if (pl >= pr) {
				reducer(opl, exprStack);
				nxtOp = { token: opr, precedence: pr };
			} else {
				opStack.push({ token: opl, precedence: pl });
				opStack.push({ token: opr, precedence: pr });
				break;
			}
		} else break;
	}
	return null;
}

function opExprReducer(opTok: Token, exprStack: Expr[]) {
	const right = exprStack.pop();
	const left = exprStack.pop();
	if (!left || !right)
		throw new Error(
			"@@internal Cant reduce expression. required minimum of 2 expr"
		);

	const op = binaryOpFromTokenKind(opTok.kind);
	if (op === null) throw new Error(`invalid binary op token ${opTok.kind}`);

	const expr = new BinaryExpr(left, op, right, span(0, 0));
	exprStack.push(expr);
}
