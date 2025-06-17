import type {
  ArrayExpr,
  AssignmentExpr,
  BinaryExpr,
  CallExpr,
  ConditionalExpr,
  EmptyExpr,
  Ident,
  LambdaExpr,
  LetExpr,
  LiteralExpr,
  MemberExpr,
  UnaryExpr,
} from './ast.js';
import type { Visitor } from './types.js';

export class FormulaVisitor<T> implements Visitor<T> {
  visitAssignExpr(expr: AssignmentExpr): T {
    throw new Error('Method not implemented.');
  }
  visitLetExpr(expr: LetExpr): T {
    throw new Error('Method not implemented.');
  }
  visitConditionalExpr(expr: ConditionalExpr): T {
    throw new Error('Method not implemented.');
  }
  visitArrayExpr(expr: ArrayExpr): T {
    throw new Error('Method not implemented.');
  }
  visitEmptyExpr(expr: EmptyExpr): T {
    throw new Error('Method not implemented.');
  }
  visitLiteralExpr(expr: LiteralExpr): T {
    throw new Error('Method not implemented.');
  }
  visitIdent(expr: Ident): T {
    throw new Error('Method not implemented.');
  }
  visitBinaryExpr(expr: BinaryExpr): T {
    throw new Error('Method not implemented.');
  }
  visitUnaryExpr(expr: UnaryExpr): T {
    throw new Error('Method not implemented.');
  }
  visitCallExpr(expr: CallExpr): T {
    throw new Error('Method not implemented.');
  }
  visitMemberExpr(expr: MemberExpr): T {
    throw new Error('Method not implemented.');
  }
  visitLambdaExpr(expr: LambdaExpr): T {
    throw new Error('Method not implemented.');
  }
}
