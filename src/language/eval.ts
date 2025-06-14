import type { Value } from "./core/value.js";
import type { Environment } from "./environment.js";
import {
	AddTrait,
	BooleanValue,
	CallTrait,
	DivTrait,
	EqTrait,
	MulTrait,
	NegTrait,
	None,
	NotTrait,
	NumberValue,
	OrdTrait,
	RemTrait,
	StringValue,
	SubTrait,
} from "./core/index.js";
import {
	Ident,
	MemberExpr,
	type BinaryExpr,
	type CallExpr,
	type LiteralExpr,
	type UnaryExpr,
} from "../ast.js";
import type { Visitor } from "../visitor.js";

export class Evaluator implements Visitor<Value> {
	constructor(public env: Environment) {}

	visitEmptyExpr(): Value {
		return None;
	}

	visitLiteralExpr(expr: LiteralExpr): Value {
		switch (typeof expr.value) {
			case "string":
				return new StringValue(expr.value);
			case "number":
				return new NumberValue(expr.value);
			case "boolean":
				return new BooleanValue(expr.value);
			default:
				return None;
		}
	}

	visitIdent(ident: Ident): Value {
		const val = this.env.get(ident.name);
		if (!val) {
			throw new Error(`Identifier '${ident.name}' is not defined.`);
		}
		return val;
	}

	visitBinaryExpr(expr: BinaryExpr): Value {
		const left = expr.left.visit(this);
		const right = expr.right.visit(this);
		switch (expr.operator) {
			case "+": {
				if (left instanceof StringValue || right instanceof StringValue) {
					return StringValue.add(left, right);
				}
				return left.getImpl(AddTrait).add(left, right);
			}
			case "-":
				return left.getImpl(SubTrait).sub(left, right);
			case "*":
				return left.getImpl(MulTrait).mul(left, right);
			case "/":
				return left.getImpl(DivTrait).div(left, right);
			case "%":
				return left.getImpl(RemTrait).rem(left, right);
			case "<": {
				const ord = left.getImpl(OrdTrait).cmp(left, right);
				return new BooleanValue(ord < 0);
			}
			case ">": {
				const ord = left.getImpl(OrdTrait).cmp(left, right);
				return new BooleanValue(ord > 0);
			}
			case "<=": {
				const ord = left.getImpl(OrdTrait).cmp(left, right);
				return new BooleanValue(ord <= 0);
			}
			case ">=": {
				const ord = left.getImpl(OrdTrait).cmp(left, right);
				return new BooleanValue(ord >= 0);
			}
			case "==": {
				// todo handle errors for non impl
				return left.getImpl(EqTrait).eq(left, right);
			}
			case "!=": {
				// todo handle errors for non impl
				return left.getImpl(EqTrait).eq(left, right).not();
			}
			case "&&":
				return new BooleanValue(left.asBoolean() && right.asBoolean());
			case "||":
				return new BooleanValue(left.asBoolean() || right.asBoolean());
			default:
				throw new Error(`Invalid Operator ${expr.operator}`);
		}
	}

	visitUnaryExpr(expr: UnaryExpr): Value {
		const operand = expr.operand.visit(this);
		switch (expr.operator) {
			case "-":
				return operand.getImpl(NegTrait).neg(operand);
			case "!":
				return operand.getImpl(NotTrait).not(operand);
			default:
				throw new Error(`Invalid Unary Operator ${expr.operator}`);
		}
	}

	visitCallExpr(expr: CallExpr): Value {
		const callee = expr.callee.visit(this);
		const args = expr.args.map((arg) => arg.visit(this));
		try {
			return callee.getImpl(CallTrait).call(callee, this.env, args);
		} catch {
			throw new Error(`${callee.typeHint} is not callable`);
		}
	}

	visitMemberExpr(expr: MemberExpr): Value {
		throw new Error("Method not implemented.");
	}
}
