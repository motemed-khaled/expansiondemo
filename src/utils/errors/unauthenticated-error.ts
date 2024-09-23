import { CustomError } from './custom-error';

export class UnauthenticatedError extends CustomError {
  statusCode: number = 401;
  constructor(message?: string) {
    super(message || 'un-authenticated error');
    Object.setPrototypeOf(this, UnauthenticatedError.prototype);
  }

  seralizeError(): { message: string; field?: string | undefined }[] {
    return [
      {
        message: this.message || 'un-authenticated error',
      },
    ];
  }
}
