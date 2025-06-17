import type { Visitor } from './visitor.js';
import {
  ArrayExpr,
  AssignmentExpr,
  BinaryExpr,
  CallExpr,
  ConditionalExpr,
  LambdaExpr,
  LetExpr,
  UnaryExpr,
  type Ident,
  type LiteralExpr,
  type MemberExpr,
} from './ast.js';
import { FormulaRuntime } from './std/runtime.js';
import { Formula } from './language/formula.js';
import type { Environment } from './language/environment.js';
import type { Value } from './language/index.js';

export class Printer implements Visitor<string> {
  visitAssignExpr(expr: AssignmentExpr): string {
    return `${expr.target.visit(this)} = ${expr.value.visit(this)}`;
  }

  visitLetExpr(expr: LetExpr): string {
    const bindings = expr.bindings.map((b) => b.visit(this)).join(', ');
    let body = '';
    if (expr.body) {
      body = `,${expr.body.visit(this)}`;
    }
    return `let(${bindings}${body})`;
  }

  visitEmptyExpr(): string {
    return '';
  }

  visitConditionalExpr(expr: ConditionalExpr): string {
    return `${expr.condition.visit(this)} ? ${expr.consequent.visit(
      this,
    )} : ${expr.alternate.visit(this)}`;
  }

  visitLambdaExpr(expr: LambdaExpr): string {
    const params = expr.params.map((p) => p.visit(this)).join(', ');
    const body = expr.body.visit(this);
    return `|${params}| ${body}`;
  }

  visitLiteralExpr(expr: LiteralExpr): string {
    if (typeof expr.value === 'string') {
      return `"${expr.value}"`;
    }
    return JSON.stringify(expr.value);
  }
  visitIdent(expr: Ident): string {
    return expr.name;
  }
  visitArrayExpr(expr: ArrayExpr): string {
    const elements = expr.elements.map((el) => el.visit(this)).join(', ');
    return `[${elements}]`;
  }
  visitBinaryExpr(expr: BinaryExpr): string {
    return `${expr.left.visit(this)} ${expr.operator} ${expr.right.visit(
      this,
    )}`;
  }
  visitUnaryExpr(expr: UnaryExpr): string {
    return `${expr.operator}${expr.operand.visit(this)}`;
  }
  visitCallExpr(expr: CallExpr): string {
    const args = expr.args.map((arg) => arg.visit(this)).join(', ');
    return `${expr.callee.visit(this)}(${args})`;
  }
  visitMemberExpr(expr: MemberExpr): string {
    return `${expr.referer.visit(this)}.${expr.property.visit(this)}`;
  }
}

export function evaluateFormula(
  source: string,
  env: Environment = new FormulaRuntime(),
): Value {
  const formula = new Formula(source, 'Eval').compile();
  const instance = formula.createInstance(env);
  return instance.eval();
}
