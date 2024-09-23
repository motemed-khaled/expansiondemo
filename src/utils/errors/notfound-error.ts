import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  statusCode: number = 404;
  constructor(message?: string) {
    super(message || 'not found error');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  seralizeError(): { message: string; field?: string | undefined }[] {
    return [
      {
        message: this.message || 'not found error',
      },
    ];
  }
}
