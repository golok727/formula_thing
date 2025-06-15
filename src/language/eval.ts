import type { Value } from "./core/value.js";
import { Environment } from "./environment.js";
import {
	AddTrait,
	BooleanValue,
	CallTrait,
	DivTrait,
	EqTrait,
	Fn,
	List,
	MulTrait,
	NegTrait,
	None,
	NotTrait,
	NumberValue,
	OrdTrait,
	PropertyAccessorTrait,
	RemTrait,
	StringValue,
	SubTrait,
} from "./core/index.js";
import {
	ArrayExpr,
	BinaryExpr,
	BinaryOp,
	ConditionalExpr,
	Ident,
	LambdaExpr,
	MemberExpr,
	type CallExpr,
	type LiteralExpr,
	type UnaryExpr,
} from "../ast.js";
import type { Visitor } from "../visitor.js";
import { StringValueImpl } from "./core/primitives/string/impl.js";

export class Evaluator implements Visitor<Value> {
	constructor(public env: Environment) {}

	visitConditionalExpr(expr: ConditionalExpr): Value {
		const condition = expr.condition.visit(this);
		return condition.asBoolean()
			? expr.consequent.visit(this)
			: expr.alternate.visit(this);
	}

	visitLambdaExpr(expr: LambdaExpr): Value {
		return new Fn((args) => {
			const localEnv = new Environment(this.env);
			expr.params.forEach((param, ix) =>
				localEnv.set(param.name, args.get(ix))
			);
			const evaluator = new Evaluator(localEnv);
			return expr.body.visit(evaluator);
		});
	}

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

	visitArrayExpr(expr: ArrayExpr): Value {
		const items = expr.elements.map((el) => el.visit(this));
		return new List(items);
	}

	visitBinaryExpr(expr: BinaryExpr): Value {
		const left = expr.left.visit(this);
		const right = expr.right.visit(this);
		switch (expr.operator) {
			case BinaryOp.Add: {
				if (left instanceof StringValue || right instanceof StringValue) {
					return StringValueImpl.add(left, right);
				}
				return left.getImpl(AddTrait).add(left, right);
			}
			case BinaryOp.Sub:
				return left.getImpl(SubTrait).sub(left, right);
			case BinaryOp.Mul:
				return left.getImpl(MulTrait).mul(left, right);
			case BinaryOp.Div:
				return left.getImpl(DivTrait).div(left, right);
			case BinaryOp.Mod:
				return left.getImpl(RemTrait).rem(left, right);
			case BinaryOp.Lt: {
				const ord = left.getImpl(OrdTrait).cmp(left, right);
				return new BooleanValue(ord < 0);
			}
			case BinaryOp.Gt: {
				const ord = left.getImpl(OrdTrait).cmp(left, right);
				return new BooleanValue(ord > 0);
			}
			case BinaryOp.LtEq: {
				const ord = left.getImpl(OrdTrait).cmp(left, right);
				return new BooleanValue(ord <= 0);
			}
			case BinaryOp.GtEq: {
				const ord = left.getImpl(OrdTrait).cmp(left, right);
				return new BooleanValue(ord >= 0);
			}
			case BinaryOp.Eq: {
				// todo handle errors for non impl
				return left.getImpl(EqTrait).eq(left, right);
			}
			case BinaryOp.NotEq: {
				// todo handle errors for non impl
				return left.getImpl(EqTrait).eq(left, right).not();
			}
			case BinaryOp.And: {
				return new BooleanValue(left.asBoolean() && right.asBoolean());
			}
			case BinaryOp.Or: {
				return new BooleanValue(left.asBoolean() || right.asBoolean());
			}
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

		const fn = callee.getImpl(CallTrait, true);

		if (!fn) {
			throw new Error(
				`'${expr.callee.toString()}' (type: ${
					callee.typeHint
				}) is not a function`
			);
		}

		try {
			return fn.call(callee, this.env, args);
		} catch (error) {
			throw new Error(
				`Error while calling function '${expr.callee.toString()}': ${
					error instanceof Error ? error.message : String(error)
				}`
			);
		}
	}

	visitMemberExpr(expr: MemberExpr): Value {
		const referer = expr.referer.visit(this);
		const access = referer.getImpl(PropertyAccessorTrait);
		const property = access.getProperty(referer, expr.property.name);
		return property;
	}
}
