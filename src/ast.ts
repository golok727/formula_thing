import { Printer } from "./utils.js";
import type { SrcSpan } from "./span.js";
import type { Visit, Visitor } from "./visitor.js";
import { Token, TokenKind } from "./parser/token.js";

export abstract class Expr implements Visit {
	constructor(public readonly span: SrcSpan) {}

	abstract visit<Result>(visitor: Visitor<Result>): Result;

	toString(_pretty: boolean = false): string {
		return this.visit(new Printer());
	}
}

export class EmptyExpr extends Expr {
	constructor(span: SrcSpan) {
		super(span);
	}

	visit<Result>(visitor: Visitor<Result>): Result {
		return visitor.visitEmptyExpr(this);
	}
}

export class LiteralExpr extends Expr {
	constructor(public readonly value: string | number | boolean, span: SrcSpan) {
		super(span);
	}

	visit<Result>(visitor: Visitor<Result>): Result {
		return visitor.visitLiteralExpr(this);
	}
}

export class Ident extends Expr {
	constructor(public readonly name: string, span: SrcSpan) {
		super(span);
	}

	visit<Result>(visitor: Visitor<Result>): Result {
		return visitor.visitIdent(this);
	}
}

export class BinaryExpr extends Expr {
	constructor(
		public readonly left: Expr,
		public readonly operator: BinaryOp,
		public readonly right: Expr,
		span: SrcSpan
	) {
		super(span);
	}

	visit<Result>(visitor: Visitor<Result>): Result {
		return visitor.visitBinaryExpr(this);
	}
}

export class UnaryExpr extends Expr {
	constructor(
		public readonly operator: UnaryOp,
		public readonly operand: Expr,
		span: SrcSpan
	) {
		super(span);
	}

	visit<Result>(visitor: Visitor<Result>): Result {
		return visitor.visitUnaryExpr(this);
	}
}

export class CallExpr extends Expr {
	constructor(
		public readonly callee: Expr,
		public readonly args: Expr[],
		span: SrcSpan
	) {
		super(span);
	}

	visit<Result>(visitor: Visitor<Result>): Result {
		return visitor.visitCallExpr(this);
	}
}

export class MemberExpr extends Expr {
	constructor(
		public readonly referer: Expr,
		public readonly property: Ident,
		span: SrcSpan
	) {
		super(span);
	}

	visit<Result>(visitor: Visitor<Result>): Result {
		return visitor.visitMemberExpr(this);
	}
}

export const BinaryOp = {
	Add: TokenKind.Plus,
	Sub: TokenKind.Minus,
	Mul: TokenKind.Star,
	Div: TokenKind.Slash,
	Mod: TokenKind.Modulo,
	Eq: TokenKind.EqEq,
	NotEq: TokenKind.NotEq,
	Lt: TokenKind.Lt,
	Gt: TokenKind.Gt,
	LtEq: TokenKind.LtEq,
	GtEq: TokenKind.GtEq,
	And: TokenKind.And,
	Or: TokenKind.Or,
} as const;

export type BinaryOp = (typeof BinaryOp)[keyof typeof BinaryOp];

export type UnaryOp = "!" | "-" | "+";
export function binaryOpFromTokenKind(kind: TokenKind): BinaryOp | null {
	switch (kind) {
		case TokenKind.Plus:
		case TokenKind.Minus:
		case TokenKind.Star:
		case TokenKind.Slash:
		case TokenKind.Modulo:
		case TokenKind.EqEq:
		case TokenKind.NotEq:
		case TokenKind.Lt:
		case TokenKind.Gt:
		case TokenKind.LtEq:
		case TokenKind.GtEq:
		case TokenKind.And:
		case TokenKind.Or:
			return kind as BinaryOp;
		default:
			return null;
	}
}

export function getOpPrecedence(op: BinaryOp): number {
	// bigger the number higher the precedence
	switch (op) {
		case BinaryOp.Or:
			return 1;

		case BinaryOp.And:
			return 2;

		case BinaryOp.Eq:
		case BinaryOp.NotEq:
			return 3;

		case BinaryOp.Lt:
		case BinaryOp.LtEq:
		case BinaryOp.Gt:
		case BinaryOp.GtEq:
			return 4;

		case BinaryOp.Add:
		case BinaryOp.Sub:
			return 5;

		case BinaryOp.Mul:
		case BinaryOp.Div:
			return 6;

		case BinaryOp.Mod:
			return 6;

		// todo
		// case BinaryOp.Exp:
		// 	return 7;
	}
}
