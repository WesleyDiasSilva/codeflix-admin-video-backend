import { EntityValidationError } from '@core/shared/domain/validators/validation.error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { union } from 'lodash';

@Catch()
export class EntityValidationFilter implements ExceptionFilter {
  catch(exception: EntityValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    console.log(exception.error);

    response.status(422).json({
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: Array.isArray(exception.error)
        ? union(
            ...exception.error.reduce(
              (acc, error) =>
                acc.concat(
                  typeof error === 'string' ? [[error]] : Object.values(error),
                ),
              [],
            ),
          )
        : ['An unexpected error occurred.'],
    });
  }
}
