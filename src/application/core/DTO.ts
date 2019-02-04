import { IStringToAny } from '../interface/IStringToAny';
import { plainToClassFromExist, classToPlain } from 'class-transformer';
import { observable, computed, action } from 'mobx';
import { IStringToString } from '../interface/IStringToString';

export class DTO {
  @observable
  public $errors: IStringToString = {};

  constructor(values: IStringToAny = {}) {
    if (values) {
      plainToClassFromExist(this, values);
    }
  }

  public setError = (key: string, value: string) => {
    this.$errors[key] = value;
  };

  public setErrors = (errors: IStringToString) => {
    this.$errors = errors;
  };

  @computed
  public get hasError() {
    return Object.keys(this.$errors).length > 0;
  }

  public getError(name: string) {
    return this.$errors && this.$errors[name] || false;
  }

  public removeErrors() {
    this.$errors = {};
  }

  public toJSON() {
    return classToPlain(this, {
      enableCircularCheck: true,
      excludePrefixes: ['$', '_']
    });
  }
}
