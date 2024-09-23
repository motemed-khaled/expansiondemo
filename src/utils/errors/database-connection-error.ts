import { CustomError } from './custom-error';

export class DatabaseConError extends CustomError {
  statusCode: number = 500;

  constructor(message?: string) {
    super(message || 'database connetion error');
    Object.setPrototypeOf(this, DatabaseConError.prototype);
  }
  seralizeError(): { message: string; field?: string | undefined }[] {
    return [
      {
        message: this.message || 'database connetion error',
      },
    ];
  }
}
