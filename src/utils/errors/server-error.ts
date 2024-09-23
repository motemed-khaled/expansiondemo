import { CustomError } from './custom-error';

export class ServerError extends CustomError {
  statusCode: number = 500;
  constructor(message?: string) {
    super(message || 'server error');
    Object.setPrototypeOf(this, ServerError.prototype);
  }
  seralizeError(): { message: string; field?: string | undefined }[] {
    return [
      {
        message: this.message || 'server error',
      },
    ];
  }
}
