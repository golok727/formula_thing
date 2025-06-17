import type { SrcSpan } from '../span.js';

export abstract class Expr implements Visit {
  constructor(public readonly span: SrcSpan) {}

  source(src: string): string {
    return src.slice(this.span.start, this.span.end);
  }

  abstract visit<Result>(visitor: Visitor<Result>): Result;
}

export interface Visitor<Result = unknown> {
  visitAssignExpr(expr: Expr): Result;
  visitLetExpr(expr: Expr): Result;
  visitConditionalExpr(expr: Expr): Result;
  visitArrayExpr(expr: Expr): Result;
  visitEmptyExpr(expr: Expr): Result;
  visitLiteralExpr(expr: Expr): Result;
  visitIdent(expr: Expr): Result;
  visitBinaryExpr(expr: Expr): Result;
  visitUnaryExpr(expr: Expr): Result;
  visitCallExpr(expr: Expr): Result;
  visitMemberExpr(expr: Expr): Result;
  visitLambdaExpr(expr: Expr): Result;
}

export interface Visit {
  visit<Result>(visitor: Visitor<Result>): Result;
}
