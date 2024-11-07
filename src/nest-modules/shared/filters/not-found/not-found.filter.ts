import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch(NotFoundError)
export class NotFoundFilter implements ExceptionFilter {
  private logger = new Logger('NotFoundFilter');
  catch(exception: NotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    this.logger.error(exception.message, exception.stack);

    response.status(404).json({
      statusCode: 404,
      error: exception.name,
      message: exception.message,
    });
  }
}
