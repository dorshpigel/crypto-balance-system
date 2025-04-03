import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ErrorHandlingService {
  throwBadRequest(message: string) {
    throw new HttpException(
      { statusCode: HttpStatus.BAD_REQUEST, message },
      HttpStatus.BAD_REQUEST,
    );
  }

  throwNotFound(message: string) {
    throw new HttpException(
      { statusCode: HttpStatus.NOT_FOUND, message },
      HttpStatus.NOT_FOUND,
    );
  }

  throwUnauthorized(message: string) {
    throw new HttpException(
      { statusCode: HttpStatus.UNAUTHORIZED, message },
      HttpStatus.UNAUTHORIZED,
    );
  }

  throwInternalServerError(message: string) {
    throw new HttpException(
      { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
