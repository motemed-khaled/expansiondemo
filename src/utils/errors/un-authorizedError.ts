import { CustomError } from './custom-error';

export class UnauthorizedError extends CustomError {
  statusCode: number = 403;

  constructor(message?: string) {
    super(message || 'un-authorized error');
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
  seralizeError(): { message: string; field?: string | undefined }[] {
    return [
      {
        message: this.message || 'un-authorized error',
      },
    ];
  }
}
