import { Sequelize } from "sequelize-typescript";
import { EntityValidationError } from "../../../../../shared/domain/validators/validation.error";
import { CategoryModelMapper } from "../category-model.mapper";
import { CategoryModel } from "../category.model";
import { Category } from "../../../../domain/category.entity";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";

describe('CategoryModelMapper', () => {
  let sequelize;

  beforeEach(async ()  => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      models: [CategoryModel],
      logging: false
    })
    await sequelize.sync({force: true})
  })

  test('should throws error when category is invalid', () => {
    const model = CategoryModel.build({
      category_id: '93b3c5b1-0b6f-4e3d-8b1d-3b1f0e1b0b1d',
    });
    try {
      CategoryModelMapper.toEntity(model);
      fail('The category is valid, but it needs throws a EntityValidationError');
    } catch (e) {
      expect(e).toBeInstanceOf(EntityValidationError);
      expect((e as EntityValidationError).errors).toMatchObject(
        {
          name: ["name should not be empty", "name must be a string", "name must be shorter than or equal to 255 characters"],
        }
      )
    }
  })

  test('should convert a category model to a category entity', () => {
    const created_at = new Date();
    const model = CategoryModel.build({
      category_id: '93b3c5b1-0b6f-4e3d-8b1d-3b1f0e1b0b1d',
      name: 'Category 1',
      description: 'Description of category 1',
      is_active: true,
      created_at,
    })
    const entity = CategoryModelMapper.toEntity(model);

    expect(entity.toJSON()).toStrictEqual(new Category({
      category_id: new Uuid('93b3c5b1-0b6f-4e3d-8b1d-3b1f0e1b0b1d'),
      name: 'Category 1',
      description: 'Description of category 1',
      is_active: true,
      created_at,
    }).toJSON())
  })

  test('should convert a category entity to a category model', () => {
    const created_at = new Date();
    const entity = new Category({
      category_id: new Uuid('93b3c5b1-0b6f-4e3d-8b1d-3b1f0e1b0b1d'),
      name: 'Category 1',
      description: 'Description of category 1',
      is_active: true,
      created_at,
    })
    const model = CategoryModelMapper.toModel(entity);

    expect(model.toJSON()).toStrictEqual(entity.toJSON())
  });
})
