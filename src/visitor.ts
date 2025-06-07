import type {
	BinaryExpr,
	CallExpr,
	Ident,
	LiteralExpr,
	MemberExpr,
	UnaryExpr,
} from "./ast.js";

export interface Visitor<Result = unknown> {
	visitLiteralExpr(expr: LiteralExpr): Result;
	visitIdent(expr: Ident): Result;
	visitBinaryExpr(expr: BinaryExpr): Result;
	visitUnaryExpr(expr: UnaryExpr): Result;
	visitCallExpr(expr: CallExpr): Result;
	visitMemberExpr(expr: MemberExpr): Result;
}

export interface Visit {
	visit<Result = unknown>(visitor: Visitor<Result>): Result;
}
