import {
  addImpl,
  getImpl,
  type Trait,
  type ValueConstructor,
} from './index.js';

export interface Value {
  readonly typeHint: string;

  asString(): string;
  asBoolean(): boolean;
  asNumber(): number;
  isNone(): boolean;

  getImpl<T>(trait: Trait<T>): Readonly<T>;
  getImpl<T>(trait: Trait<T>, optional: true): Readonly<T> | null;
}

export abstract class BaseValue implements Value {
  abstract typeHint: string;

  abstract asString(): string;
  abstract asBoolean(): boolean;
  abstract asNumber(): number;

  isNone(): boolean {
    return false;
  }

  getImpl<T>(trait: Trait<T>): Readonly<T>;
  getImpl<T>(trait: Trait<T>, optional: true): Readonly<T> | null;
  getImpl<T>(trait: Trait<T>, optional?: true): Readonly<T> | null {
    return getImpl<T>(
      this.constructor as ValueConstructor,
      trait,
      optional as true,
    );
  }

  static getImpl<T>(trait: Trait<T>): Readonly<T>;
  static getImpl<T>(trait: Trait<T>, optional: true): Readonly<T> | null;
  static getImpl<T>(trait: Trait<T>, optional?: true): Readonly<T> | null {
    return getImpl<T>(
      this as unknown as ValueConstructor,
      trait,
      optional as true,
    );
  }

  static addImpl<T>(trait: Trait<T>, impl: T, replace?: boolean) {
    addImpl<T>(this as unknown as ValueConstructor, trait, impl, replace);
    return this;
  }

  toString(): string {
    return this.asString();
  }

  static is(val: unknown): val is BaseValue {
    return val instanceof BaseValue;
  }

  static readonly properties: PropertyAccessorMap<any> = {};
}

export type PropertyAccessorMap<Self extends Value = Value> = Record<
  string,
  (me: Self) => Value
>;
