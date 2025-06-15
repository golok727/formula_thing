import type { Visitor } from "./visitor.js";
import {
	ArrayExpr,
	BinaryExpr,
	CallExpr,
	UnaryExpr,
	type Expr,
	type Ident,
	type LiteralExpr,
	type MemberExpr,
} from "./ast.js";

export class Printer implements Visitor<string> {
	visitEmptyExpr(): string {
		return "";
	}
	visitLiteralExpr(expr: LiteralExpr): string {
		return JSON.stringify(expr.value);
	}
	visitIdent(expr: Ident): string {
		return expr.name;
	}
	visitArrayExpr(expr: ArrayExpr): string {
		const elements = expr.elements.map((el) => el.visit(this)).join(", ");
		return `[${elements}]`;
	}
	visitBinaryExpr(expr: BinaryExpr): string {
		return `${expr.left.visit(this)} ${expr.operator} ${expr.right.visit(
			this
		)}`;
	}
	visitUnaryExpr(expr: UnaryExpr): string {
		return `${expr.operator}${expr.operand.visit(this)}`;
	}
	visitCallExpr(expr: CallExpr): string {
		const args = expr.args.map((arg) => arg.visit(this)).join(", ");
		return `${expr.callee.visit(this)}(${args})`;
	}
	visitMemberExpr(expr: MemberExpr): string {
		return `${expr.referer.visit(this)}.${expr.property.visit(this)}`;
	}
}

export class LruCache<K, V> {
	private cache: Map<K, V>;
	private maxSize: number;

	constructor(maxSize: number) {
		this.cache = new Map();
		this.maxSize = maxSize;
	}

	get(key: K): V | undefined {
		const value = this.cache.get(key);
		if (value !== undefined) {
			this.cache.delete(key);
			this.cache.set(key, value); // Move to the end
		}
		return value;
	}

	set(key: K, value: V): void {
		if (this.cache.has(key)) {
			this.cache.delete(key);
		} else if (this.cache.size >= this.maxSize) {
			const firstKey = this.cache.keys().next().value;
			if (firstKey) {
				this.cache.delete(firstKey);
			}
		}
		this.cache.set(key, value);
	}
}
