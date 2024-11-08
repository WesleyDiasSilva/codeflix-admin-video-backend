import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory/in-memory.repository';
import { Category } from '../../../domain/category.aggregate';
import { ICategoryRepository } from '../../../domain/category.repository';

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category, Uuid>
  implements ICategoryRepository
{
  sortableFields: string[] = ['name', 'created_at'];
  protected async applyFilter(
    entities: Category[],
    filter: string,
  ): Promise<Category[]> {
    if (!filter) {
      return entities;
    }
    return entities.filter((entity) =>
      entity.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  protected applySort(
    entities: Category[],
    sort: string | null,
    sort_dir: SortDirection | null,
    custom_getter?: (sort: string, entity: Category) => any,
  ): Category[] {
    return sort
      ? super.applySort(entities, sort, sort_dir, custom_getter)
      : super.applySort(entities, 'created_at', 'desc');
  }
  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
