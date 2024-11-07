import { ICategoryRepository } from '@core/category/domain/category.repository';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { INestApplication } from '@nestjs/common';
import { CATEGORY_PROVIDERS } from 'src/nest-modules/categories-module/categories.providers';
import { CreateCategoryFixture } from 'src/nest-modules/categories-module/testing/category-fixture';
import { startApp } from 'src/nest-modules/shared/testing/helpers';
import request from 'supertest';

describe('CategoriesController (e2e)', () => {
  const appHelper = startApp();
  let app: INestApplication;
  let categoryRepo: ICategoryRepository;

  beforeEach(() => {
    categoryRepo = appHelper.app.get<ICategoryRepository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
    app = appHelper.app;
  });

  describe('/categories (POST)', () => {
    describe('should create a category', () => {
      const arrange = CreateCategoryFixture.arrangeForCreate();
      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const res = await request(app.getHttpServer())
            .post('/categories')
            .send(send_data)
            .expect(201);

          const keysInResponse = CreateCategoryFixture.keysInResponse;
          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);
          const id = res.body.data.id;
          const entity = await categoryRepo.findById(new Uuid(id));
          expect(entity.toJSON()).toStrictEqual({
            category_id: entity.category_id.id,
            created_at: entity.created_at,
            ...expected,
          });
        },
      );
    });

    describe('should return status code 422 when body is invalid', () => {
      const invalidRequest = CreateCategoryFixture.arrangeInvalidRequest();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.getHttpServer())
          .post('/categories')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should return status code 422 when throw EntityValidationError', () => {
      const invalidRequest =
        CreateCategoryFixture.arrangeForEntityValidationError();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.getHttpServer())
          .post('/categories')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });
  });
});
