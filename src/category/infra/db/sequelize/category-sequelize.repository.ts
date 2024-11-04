import { Op } from "sequelize";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { ISearchableRepository } from "../../../../shared/domain/repository/repository-interface";
import { SearchResult } from "../../../../shared/domain/repository/search-result";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategorySearchParams, CategorySearchResult } from "../../../domain/category.repository";
import { CategoryModelMapper } from "./category-model.mapper";
import { CategoryModel } from "./category.model";

export class CategorySequelizeRepository implements ISearchableRepository<Category, Uuid>{
  sortableFields: string[] = ['name', 'created_at'] ;
  
  constructor(private categoryModel: typeof CategoryModel){}

  async insert(entity: Category): Promise<void> {
    const model = CategoryModelMapper.toModel(entity)
    await this.categoryModel.create(model.toJSON())
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    const models = entities.map(entity => CategoryModelMapper.toModel(entity))
    await this.categoryModel.bulkCreate(models.map(model => model.toJSON()))
  }

  async update(entity: Category): Promise<void> {
    const id = entity.category_id.id
    const model = await this._get(id)
    if (!model) {
      throw new NotFoundError(entity.category_id.id, this.getEntity())
    }
    const modelToUpdate = CategoryModelMapper.toModel(entity)
    await this.categoryModel.update(modelToUpdate.toJSON(), {where: {category_id: id}})
  }

  async delete(entity_id: Uuid): Promise<void> {
    const id = entity_id.id
    const model = await this._get(id)
    if (!model) {
      throw new NotFoundError(id, this.getEntity())
    }
    await this.categoryModel.destroy({ where: { category_id: id } })
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll()
    return models.map(model => CategoryModelMapper.toEntity(model));
  }

  async findById(entity_id: Uuid): Promise<Category | null> {
    const model = await this._get(entity_id.id)
    
    return model ? CategoryModelMapper.toEntity(model) : null
  }

  private async _get(id: string)  {
    return await this.categoryModel.findByPk(id)
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }

  async search(props: CategorySearchParams): Promise<SearchResult<Category>> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;
    const { rows: models, count} = await this.categoryModel.findAndCountAll({
      ...(props.filter && {
        where: {
          name: {[Op.like]: `%${props.filter}%`}
        },
      }),
      ...(props.sort && this.sortableFields.includes(props.sort))
        ?  {order: [[props.sort, props.sort_dir]]}
        : {order: [['created_at', 'desc']]},
        offset,
        limit
    })
    return new CategorySearchResult({
      items: models.map((model) => {
        return CategoryModelMapper.toEntity(model)
      }),
      total: count,
      current_page: props.page,
      per_page: props.per_page
    })
  }
}