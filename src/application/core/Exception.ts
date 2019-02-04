import { IStringToString } from '../interface/IStringToString';

export class Exception extends Error {
  constructor(
    public code: number,
    public error: string,
    public errors: IStringToString = {}
  ) {
    super(error);
  }

  public toString() {
    return `Code: ${this.code}, Message: ${
      this.message
    }, Errors: ${JSON.stringify(this.errors)}`;
  }
}
