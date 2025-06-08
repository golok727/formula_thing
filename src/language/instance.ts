import {
	type LiteralExpr,
	Ident,
	type BinaryExpr,
	type UnaryExpr,
	type CallExpr,
	type MemberExpr,
} from "../ast.js";
import type { Visitor } from "../visitor.js";
import type { Environment } from "./environment.js";
import type { Formula } from "./formula.js";
import type { EnvDefineConfig } from "./types.js";
import {
	BooleanValue,
	None,
	NumberValue,
	AddTrait,
	StringValue,
	type Value,
	SubTrait,
	MulTrait,
	DivTrait,
	RemTrait,
	OrdTrait,
	EqTrait,
	NegTrait,
	NotTrait,
} from "./core/index.js";

export class Instance<Env extends Environment = Environment> {
	constructor(
		public readonly formula: Formula,
		public readonly environment: Env
	) {
		if (!formula.isCompiled()) {
			throw new Error("Formula must be compiled before creating an instance.");
		}
	}

	define(def: EnvDefineConfig<Env>): this {
		this.environment.define(def);
		return this;
	}

	eval() {
		const interpreter = new SimpleInterpreter(this.environment);
		return this.formula.visit(interpreter);
	}
}

class SimpleInterpreter implements Visitor<Value> {
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
		const val = this.env.getVariable(ident.name);
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
		if (!(expr.callee instanceof Ident)) {
			throw new Error("Call expression must have an identifier as callee.");
		}
		const fn = this.env.getFunction(expr.callee.name);
		if (!fn) {
			throw new Error(`Function '${expr.callee.name}' is not defined.`);
		}
		const args = expr.args.map((arg) => arg.visit(this));
		return fn.call(args);
	}
	visitMemberExpr(expr: MemberExpr): Value {
		throw new Error("Method not implemented.");
	}
}
