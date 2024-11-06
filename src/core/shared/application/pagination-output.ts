import { SearchResult } from '../domain/repository/search-result';

export type PaginationOutput<Item = any> = {
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
  items: Item[];
};

export class PaginationOutputMapper {
  static toOutput<Item = any>(
    items: Item[],
    props: Omit<SearchResult, 'items'>,
  ): PaginationOutput<Item> {
    return {
      items,
      total: props.total,
      current_page: props.current_page,
      last_page: props.last_page,
      per_page: props.per_page,
    };
  }
}
