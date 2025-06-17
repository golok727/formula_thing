import { EqTrait, NotTrait, OrdTrait, type Eq } from '../../op.js';
import { BooleanValue } from './bool.js';
import { BoolValueImpl } from './impl.js';
import { NumberValueImpl } from '../number/impl.js';
import { implPropertyAccessor } from '../../utils.js';
import { implCoreArithmetic } from '../common.js';

BooleanValue.addImpl<Eq<BooleanValue>>(EqTrait, BoolValueImpl)
  .addImpl(NotTrait, BoolValueImpl)
  .addImpl(OrdTrait, NumberValueImpl);

implCoreArithmetic(BooleanValue);
implPropertyAccessor(BooleanValue);

export * from './impl.js';
export * from './bool.js';
