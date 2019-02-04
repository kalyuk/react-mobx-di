import 'reflect-metadata';
import { validateSync } from 'class-validator';

import { PARAM_KEY } from './value';
import { DTO } from '../core/DTO';
import { Exception } from '../core/Exception';

export function validate(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>
) {
  const oldMethod = descriptor.value;
  const params =
    Reflect.getMetadata(PARAM_KEY, target.constructor, propertyName) || [];

  const paramsTypes = Reflect.getMetadata(
    'design:paramtypes',
    target,
    propertyName
  );

  // tslint:disable-next-line
  descriptor.value = function(...data: any[]) {
    params.forEach(([index, key, argIndex]: any) => {
      const rawValue = key.lenght
        ? key.split('.').reduce((o: any, i: any) => o[i], data[argIndex])
        : data[argIndex];

      if (paramsTypes[index]) {
        const instance =
          rawValue instanceof paramsTypes[index]
            ? rawValue
            : new paramsTypes[index](rawValue);

        if (instance instanceof DTO) {
          instance.removeErrors();
          const result = validateSync(instance);

          if (result.length) {
            const errors: any = {};

            result.forEach(error => {
              errors[error.property] =
                error.constraints[Object.keys(error.constraints)[0]];
            });

            instance.setErrors(errors);

            throw new Exception(409, 'invalid input data', errors);
          }
          data[index] = instance;
        } else {
          data[index] = rawValue;
        }
      }
    });

    return oldMethod.apply(this, data);
  };
}
