import {
  type Expr,
  type BinaryOp,
  BinaryExpr,
  CallExpr,
  Ident,
  LiteralExpr,
} from './ast.js';
import { span } from './span.js';

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

export function $b(left: Expr, operator: BinaryOp, right: Expr) {
  return new BinaryExpr(left, operator, right, span(0, 0));
}

export function $concat(...expr: Expr[]) {
  return new CallExpr(new Ident('concat', span(0, 0)), expr, span(0, 0));
}

function someoneIs(suffix: Expr) {
  // return $b($prop("Name"), "+", $b($str(" is "), "+", suffix));
  return $concat($prop('Name'), $str(' is '), suffix);
}

export function $now() {
  return new CallExpr(new Ident('now', span(0, 0)), [], span(0, 0));
}

export function $prop(name: string) {
  return new CallExpr(
    new Ident('prop', span(0, 0)),
    [new LiteralExpr(name, span(0, 0))],
    span(0, 0),
  );
}

export function $num(value: number) {
  return new LiteralExpr(value, span(0, 0));
}
export function $str(value: string) {
  return new LiteralExpr(value, span(0, 0));
}
export function $bool(value: boolean) {
  return new LiteralExpr(value, span(0, 0));
}

export function $if(condition: Expr, trueExpr: Expr, falseExpr: Expr) {
  return new CallExpr(
    new Ident('if', span(0, 0)),
    [condition, trueExpr, falseExpr],
    span(0, 0),
  );
}

// export const SAMPLE_FORMULA = $now();
// export const SAMPLE_FORMULA = $b($prop("Name"), "+", $prop("Age"));

export const SAMPLE_FORMULA = $if(
  $b($prop('Age'), '>=', $num(18)),
  someoneIs($str('Adult')),
  someoneIs($str('Minor')),
  // someoneIs(prop("Name")),
  // someoneIs(prop("Name")),
  // str("Adult"),
  // str("Minor"),
);

export type CellValue = string | number | boolean | null;

type Column = string;
type RowId = string;
export class MockDataSource implements DataSource {
  data: Record<Column, Record<RowId, CellValue>>;

  constructor(
    data: Record<string, Record<string, CellValue>> = Object.create(null),
    public title: string = 'Mock Data Source',
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
