import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { WrapperDataInterceptor } from './nest-modules/shared/interceptors/wrapper-data/wrapper-data.interceptor';
import { NotFoundFilter } from './nest-modules/shared/filters/not-found/not-found.filter';
import { EntityValidationFilter } from './nest-modules/shared/filters/entity-validation/entity-validation.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
    }),
  );
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalInterceptors(new WrapperDataInterceptor());
  app.useGlobalFilters(new NotFoundFilter());
  app.useGlobalFilters(new EntityValidationFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
