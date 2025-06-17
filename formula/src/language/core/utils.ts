import { PropertyAccessorTrait, type PropertyAccessor } from './op/index.js';
import { None } from './primitives/index.js';

import { addImpl, type ValueConstructor } from './trait.js';
import type { Value } from './value.js';

export function implPropertyAccessor<C extends ValueConstructor>(cstr: C) {
  addImpl(cstr, PropertyAccessorTrait, {
    getProperty(me: Value, prop: string): Value {
      const get = cstr.properties[prop];
      if (get) {
        return get(me as InstanceType<C>);
      }
      return None;
    },
  } satisfies PropertyAccessor);
}
