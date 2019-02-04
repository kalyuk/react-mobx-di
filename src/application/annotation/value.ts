import 'reflect-metadata';

export const PARAM_KEY = 'validate:params';
export function value(key?: string | number, argumentIndex: number = 0) {
  return (target: any, propertyKey: string | symbol, index: number) => {
    const existingParams: any[] =
      Reflect.getOwnMetadata(PARAM_KEY, target.constructor, propertyKey) || [];

    existingParams.push([
      index,
      typeof key === 'number' ? '' : key || '',
      typeof key === 'number' ? key : argumentIndex
    ]);

    Reflect.defineMetadata(
      PARAM_KEY,
      existingParams,
      target.constructor,
      propertyKey
    );
  };
}
