import { BinaryExpr, CallExpr, Ident, LiteralExpr, MemberExpr } from "./ast.js";
import { span } from "./span.js";

/*
 /// formula
 if(prop("Age") > 18, "Adult", "Minor")
*/
let ifMinor = new CallExpr(
	new MemberExpr(
		new LiteralExpr("Minor", span(0, 0)),
		new Ident("bold", span(0, 0)),
		span(0, 0)
	),
	[],
	span(0, 0)
);

export const SAMPLE_FORMULA = new CallExpr(
	new Ident("if", span(0, 0)),
	[
		new BinaryExpr(
			new CallExpr(
				new Ident("prop", span(0, 0)),
				[new LiteralExpr("Age", span(0, 0))],
				span(0, 0)
			),
			">",
			new LiteralExpr(18, span(0, 0)),
			span(0, 0)
		),
		new LiteralExpr("Adult", span(0, 0)),
		// new LiteralExpr("Minor", span(0, 0)),
		ifMinor,
	],
	span(0, 0)
);

export type CellValue = string | number | boolean | null;

type Column = string;
type RowId = string;
export class MockDataSource implements DataSource {
	data: Record<Column, Record<RowId, CellValue>>;

	constructor(
		data: Record<string, Record<string, CellValue>> = Object.create(null)
	) {
		this.data = data;
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
	getCell(rowId: string, columnName: string): CellValue;
	updateCell(rowId: string, columnName: string, value: CellValue): void;
}
