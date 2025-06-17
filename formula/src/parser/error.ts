import type { SrcSpan } from '../span.js';

export const ParseErrorKind = {
  ExpectedExpression: 'ExpectedExpression',
} as const;

export type ParseErrorKind =
  (typeof ParseErrorKind)[keyof typeof ParseErrorKind];

export class ParseError extends Error {
  constructor(
    public readonly kind: ParseErrorKind,
    public span: SrcSpan,
  ) {
    super();
  }
}
