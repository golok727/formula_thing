import type { SrcSpan } from "../span.js";

export const TokenKind = {
	Eof: "eof",
	Boolean: "boolean",
	Number: "number",
	String: "string",
	Ident: "ident",
	Keyword: "keyword",
	Plus: "+",
	Minus: "-",
	Star: "*",
	Slash: "/",
	Modulo: "%",
	BackSlash: "\\",
	OpenParen: "(",
	CloseParen: ")",
	OpenBracket: "[",
	CloseBracket: "]",
	Unknown: "unknown",
	Comma: ",",
	Dot: ".",
	EqEq: "==",
	NotEq: "!=",
	Not: "!",
	Lt: "<",
	Gt: ">",
	LtEq: "<=",
	GtEq: ">=",
	Colon: ":",
	Question: "?",
	And: "&&",
	Or: "||",
} as const;

export type TokenKind = (typeof TokenKind)[keyof typeof TokenKind];

export function tryGetKeywordFromString(kind: string): TokenKind | null {
	switch (kind) {
		case "or":
			return TokenKind.Or;
		case "and":
			return TokenKind.And;
		case "not":
			return TokenKind.Not;
		case "true":
		case "false":
			return TokenKind.Boolean;
		default:
			return null;
	}
}

export class Token {
	constructor(
		public readonly kind: TokenKind,
		public readonly span: SrcSpan,
		public readonly value: string | number | boolean | undefined = undefined
	) {}

	source(src: string): string {
		return src.slice(this.span.start, this.span.end);
	}
	toString(): string {
		return `Token(kind = '${this.kind}')`;
	}
}
