import 'reflect-metadata';
import { observable, decorate } from 'mobx';
export const SYNC_PARAM_KEY = 'sync:params:';

export function sync(target: any, propertyName: string) {
  const name = '____' + propertyName + '____';
  Object.defineProperty(target, propertyName, {
    get() {
      return this[name];
    },
    set(value: any) {
      if (global.IS_BROWSER) {
        localStorage.setItem(
          SYNC_PARAM_KEY + propertyName,
          JSON.stringify(value)
        );
      }
      this[name] = value;
    }
  });

  const decorators: any = {};
  decorators[name] = observable;
  decorate(target.constructor, decorators);

  const existingParams: any[] =
    Reflect.getOwnMetadata(SYNC_PARAM_KEY, target.constructor, propertyName) ||
    [];
  existingParams.push(propertyName);
  Reflect.defineMetadata(SYNC_PARAM_KEY, existingParams, target.constructor);
}
