import type { Formula } from './formula.ts';
import { Instance } from './instance.js';
import type { EnvDefineConfig, ValueDefinition } from './types.js';
import { Fn, None, type Value } from './core/index.js';

export class Environment {
  private _values: Map<string, ValueDefinition> = new Map();

  get parent(): Environment | null {
    return this._parent;
  }

  constructor(protected _parent: Environment | null = null) {}

  set(name: string, value: Value, override: boolean = false): this {
    this.define({
      type: 'value',
      linkname: name,
      value,
      override: override,
    });
    return this;
  }

  get(name: string): Value | null {
    const variable = this._values.get(name);
    if (variable) {
      if (typeof variable.value === 'function') {
        return variable.value(this);
      } else {
        return variable.value;
      }
    } else {
      return this._parent?.get(name) ?? null;
    }
  }

  define(def: EnvDefineConfig<this>): this {
    if (def.type === 'function') {
      this.define({
        type: 'value',
        linkname: def.linkname,
        description: def.description,
        override: false,
        value: new Fn((args) => def.fn(this, args) ?? None, def.linkname),
      });
    } else if (def.type === 'value') {
      if (!def.override && this._values.has(def.linkname)) {
        throw new Error(`Name '${def.linkname}' is already defined.`);
      }
      this._values.set(def.linkname, def as ValueDefinition);
    }

    return this;
  }

  setParent(parent: Environment): this {
    if (parent === this) {
      return this;
    }
    this._parent = parent;
    return this;
  }
}
