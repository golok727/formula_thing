import type { Expr } from '../ast.js';
import { FormulaParseError } from '../parser/error.js';
import { Parser } from '../parser/parse.js';
import type { Visit, Visitor } from '../visitor.ts';
import { Environment } from './environment.js';
import { Instance } from './instance.js';

export class CompilationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CompilationError';
  }
}

export class Formula implements Visit {
  private _root: Expr | null = null;

  constructor(
    public readonly source: string,
    public readonly name: string = 'Unnamed formula',
  ) {}

  visit<Result = unknown>(visitor: Visitor<Result>): Result {
    if (!this._root) {
      throw new Error('Formula is not compiled.');
    }
    return this._root.visit(visitor);
  }

  isCompiled(): boolean {
    return this._root !== null;
  }

  /**
   * Create an instance of the formula. Will throw an error if the formula is not compiled.
   */
  createInstance(): Instance<Environment>;
  createInstance<Env extends Environment = Environment>(
    env: Env,
  ): Instance<Env>;
  createInstance(env?: Environment): Instance<Environment> {
    return new Instance(this, env ?? new Environment());
  }

  compile(): this {
    const error = this.compileSafe()[1];
    if (error) {
      throw error;
    }
    return this;
  }

  compileSafe():
    | [formula: Formula, error: null]
    | [formula: null, error: Error] {
    try {
      const parser = new Parser(this.source);
      const root = parser.parse();
      this._root = root;
      return [this, null];
    } catch (e) {
      if (e instanceof FormulaParseError) {
        return [
          null,
          new CompilationError(
            `ParseError: ${e.message} at [${e.span.start}:${e.span.end}]`,
          ),
        ];
      }
      throw e;
    }
  }

  toString(pretty?: boolean): string {
    return this._root?.toString(pretty) ?? '<not compiled>';
  }
}
