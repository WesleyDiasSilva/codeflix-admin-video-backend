import { ListCategoriesInput } from '@core/category/application/use-cases/list-category/list-category.use-case';
import { SortDirection } from '@core/shared/domain/repository/search-params';

export class SearchCategoriesDTO implements ListCategoriesInput {
  filter?: string;
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
}