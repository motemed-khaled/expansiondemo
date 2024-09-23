import { ValidationError as vError } from 'express-validator';

import { CustomError } from './custom-error';

export class validationError extends CustomError {
  statusCode: number = 422;
  constructor(public error: vError[]) {
    super('validation error');
    Object.setPrototypeOf(this, validationError.prototype);
  }
  seralizeError(): { message: string; field?: string | undefined }[] {
    return this.error.map((el) => {
      if (el.type === 'field') return { message: el.msg, field: el.path };
      return { message: el.msg };
    });
  }
}
