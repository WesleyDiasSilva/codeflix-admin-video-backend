import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EntityValidationFilter } from './shared/filters/entity-validation/entity-validation.filter';
import { NotFoundFilter } from './shared/filters/not-found/not-found.filter';
import { WrapperDataInterceptor } from './shared/interceptors/wrapper-data/wrapper-data.interceptor';

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
    }),
  );
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new WrapperDataInterceptor(),
  );
  app.useGlobalFilters(new NotFoundFilter(), new EntityValidationFilter());
}
