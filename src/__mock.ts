import {
	BinaryExpr,
	CallExpr,
	Expr,
	Ident,
	LiteralExpr,
	MemberExpr,
	type BinaryOp,
} from "./ast.js";
import { span } from "./span.js";

/*
 /// formula
 if(prop("Age") > 18, "Adult", "Minor")
*/
// let ifMinor = new CallExpr(
// 	new MemberExpr(
// 		new LiteralExpr("Minor", span(0, 0)),
// 		new Ident("bold", span(0, 0)),
// 		span(0, 0)
// 	),
// 	[],
// 	span(0, 0)
// );

function b(left: Expr, operator: BinaryOp, right: Expr) {
	return new BinaryExpr(left, operator, right, span(0, 0));
}

function someoneIs(suffix: Expr) {
	return b(prop("Name"), "+", b(str(" is "), "+", suffix));
}

function prop(name: string) {
	return new CallExpr(
		new Ident("prop", span(0, 0)),
		[new LiteralExpr(name, span(0, 0))],
		span(0, 0)
	);
}

function num(value: number) {
	return new LiteralExpr(value, span(0, 0));
}
function str(value: string) {
	return new LiteralExpr(value, span(0, 0));
}
function bool(value: boolean) {
	return new LiteralExpr(value, span(0, 0));
}

export const SAMPLE_FORMULA = new CallExpr(
	new Ident("if", span(0, 0)),
	[
		b(prop("Age"), ">=", num(18)),
		// someoneIs(prop("Name")),
		// someoneIs(prop("Name")),
		someoneIs(str("Adult")),
		someoneIs(str("Minor")),
		// str("Adult"),
		// str("Minor"),
	],
	span(0, 0)
);

export type CellValue = string | number | boolean | null;

type Column = string;
type RowId = string;
export class MockDataSource implements DataSource {
	data: Record<Column, Record<RowId, CellValue>>;

	constructor(
		data: Record<string, Record<string, CellValue>> = Object.create(null),
		public title: string = "Mock Data Source"
	) {
		this.data = data;
	}

	getTitle(): string {
		return this.title;
	}

	getCell(rowId: string, columnId: string): CellValue {
		return this.data[columnId]?.[rowId] ?? null;
	}
	updateCell(rowId: string, columnName: string, value: CellValue): void {
		if (!this.data[columnName]) {
			this.data[columnName] = {};
		}
		this.data[columnName][rowId] = value;
	}
}

export interface DataSource {
	getTitle(): string;
	getCell(rowId: string, columnName: string): CellValue;
	updateCell(rowId: string, columnName: string, value: CellValue): void;
}
