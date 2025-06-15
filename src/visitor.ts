import type {
	ArrayExpr,
	BinaryExpr,
	CallExpr,
	EmptyExpr,
	Ident,
	LiteralExpr,
	MemberExpr,
	UnaryExpr,
} from "./ast.js";

export interface Visitor<Result = unknown> {
	visitArrayExpr(expr: ArrayExpr): Result;
	visitEmptyExpr(expr: EmptyExpr): Result;
	visitLiteralExpr(expr: LiteralExpr): Result;
	visitIdent(expr: Ident): Result;
	visitBinaryExpr(expr: BinaryExpr): Result;
	visitUnaryExpr(expr: UnaryExpr): Result;
	visitCallExpr(expr: CallExpr): Result;
	visitMemberExpr(expr: MemberExpr): Result;
}

export interface Visit {
	visit<Result>(visitor: Visitor<Result>): Result;
}
