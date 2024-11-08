import { CategoryOutputMapper } from '@core/category/application/use-cases/common/category-output';
import { Category } from '@core/category/domain/category.aggregate';
import { ICategoryRepository } from '@core/category/domain/category.repository';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from 'src/nest-modules/config/config.module';
import { DatabaseModule } from 'src/nest-modules/database/database.module';
import { CategoriesController } from '../categories.controller';
import { CategoriesModule } from '../categories.module';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from '../categories.presenter';
import { CATEGORY_PROVIDERS } from '../categories.providers';
import {
  CreateCategoryFixture,
  ListCategoriesFixture,
  UpdateCategoryFixture,
} from '../testing/category-fixture';

describe('CategoriesController Integration Tests', () => {
  let controller: CategoriesController;
  let repository: ICategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();
    controller = module.get<CategoriesController>(CategoriesController);
    repository = module.get<ICategoryRepository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeDefined();
    expect(controller['deleteCategoryUseCase']).toBeDefined();
    expect(controller['getCategoryUseCase']).toBeDefined();
    expect(controller['listCategoriesUseCase']).toBeDefined();
    expect(controller['updateCategoryUseCase']).toBeDefined();
  });

  describe('should create a category', () => {
    const arrange = CreateCategoryFixture.arrangeForCreate();
    test.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.create(send_data);
        const entity = await repository.findById(new Uuid(presenter.id));
        expect(entity.toJSON()).toStrictEqual({
          category_id: presenter.id,
          created_at: presenter.created_at,
          ...expected,
        });
        const output = CategoryOutputMapper.toOutput(entity);
        expect(presenter).toEqual(new CategoryPresenter(output));
      },
    );
  });

  describe('should throw error of entity validation', () => {
    it('when name is too long', async () => {
      const { NAME_TOO_LONG } =
        CreateCategoryFixture.arrangeForEntityValidationError();
      expect(controller.create(NAME_TOO_LONG.send_data)).rejects.toThrow(
        EntityValidationError,
      );
    });
  });

  describe('should update a category', () => {
    const arrange = UpdateCategoryFixture.arrangeForUpdate();

    const category = Category.fake().aCategory().build();
    beforeEach(async () => {
      await repository.insert(category);
    });

    test.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.update(
          category.category_id.id,
          send_data,
        );
        const entity = await repository.findById(category.category_id);
        expect(entity.toJSON()).toStrictEqual({
          category_id: presenter.id,
          created_at: presenter.created_at,
          name: expected.name ?? category.name,
          description:
            'description' in expected
              ? expected.description
              : category.description,
          is_active:
            expected.is_active === true || expected.is_active === false
              ? expected.is_active
              : category.is_active,
        });
        const output = CategoryOutputMapper.toOutput(entity);
        expect(presenter).toEqual(new CategoryPresenter(output));
      },
    );
  });

  it('should delete a category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    await controller.remove(category.category_id.id);
    const entity = await repository.findById(category.category_id);
    expect(entity).toBeNull();
  });

  it('should get a category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    const presenter = await controller.findOne(category.category_id.id);
    const output = CategoryOutputMapper.toOutput(category);
    expect(presenter).toEqual(new CategoryPresenter(output));
  });

  describe('search method', () => {
    describe('should sorted categories by created_at', () => {
      const { arrange, entitiesMap } =
        ListCategoriesFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when send_data is $send_data',
        async ({ send_data, expected }) => {
          const presenter = await controller.search(send_data);
          const { entities, ...paginationProps } = expected;
          expect(presenter).toEqual(
            new CategoryCollectionPresenter({
              items: entities.map((entity) =>
                CategoryOutputMapper.toOutput(entity),
              ),
              ...paginationProps.meta,
            }),
          );
        },
      );
    });

    describe('should return categories using pagination, sort and filter', () => {
      const { arrange, entitiesMap } = ListCategoriesFixture.arrangeUnsorted();

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when send_data is $send_data',
        async ({ send_data, expected }) => {
          const presenter = await controller.search(send_data);
          const { entities, ...paginationProps } = expected;
          expect(presenter).toEqual(
            new CategoryCollectionPresenter({
              items: entities.map((entity) =>
                CategoryOutputMapper.toOutput(entity),
              ),
              ...paginationProps.meta,
            }),
          );
        },
      );
    });
  });
});
