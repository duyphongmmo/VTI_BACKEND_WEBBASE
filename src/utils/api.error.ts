import { getMessage, ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';

export class ApiError extends Error {
  private readonly _errorCode: ResponseCodeEnum;

  private readonly _message: string;

  constructor(errorCode: ResponseCodeEnum, message?: string) {
    super(message);

    this._errorCode = errorCode;
    this._message = message;
  }

  get errorCode(): ResponseCodeEnum {
    return this._errorCode;
  }

  get message(): string {
    return this._message || getMessage(this._errorCode);
  }

  toResponse(): ResponsePayload<any> {
    return new ResponseBuilder<unknown>()
      .withCode(this._errorCode)
      .withMessage(this.message)
      .build();
  }
}
