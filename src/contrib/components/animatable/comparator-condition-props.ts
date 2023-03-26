import { conditionValues } from './comparator-condition-values';
import { ComparatorConditionComponentValue } from './comparator-condition-component-value';
import { ComparatorConditionNumberValue } from './comparator-condition-number-value';
import type { OperationType, ComparatorConditionPropsConfig } from './types';

export class ComparatorConditionProps {
  operation: OperationType;
  arg1: ComparatorConditionComponentValue | ComparatorConditionNumberValue;
  arg2: ComparatorConditionComponentValue | ComparatorConditionNumberValue;

  constructor(config: unknown) {
    const { operation, arg1, arg2 } = config as ComparatorConditionPropsConfig;

    this.operation = operation;

    this.arg1 = new conditionValues[arg1.type](arg1);
    this.arg2 = new conditionValues[arg2.type](arg2);
  }
}
