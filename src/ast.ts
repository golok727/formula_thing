import { Printer } from "./utils.js";
import type { SrcSpan } from "./span.js";
import type { Visit, Visitor } from "./visitor.js";

export abstract class Expr implements Visit {
	constructor(public readonly span: SrcSpan) {}

	abstract visit<Result>(visitor: Visitor<Result>): Result;

	toString(_pretty: boolean = false): string {
		return this.visit(new Printer());
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

export type BinaryOp =
	| "+"
	| "-"
	| "*"
	| "/"
	| "%"
	| "=="
	| "!="
	| "<"
	| "<="
	| ">"
	| ">="
	| "&&"
	| "||";

export type UnaryOp = "!" | "-" | "+";

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
