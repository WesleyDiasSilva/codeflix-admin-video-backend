import { PaginationPresenter } from 'src/nest-modules/shared/pagination.presenter';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from '../categories.presenter';

describe('CategoriesPresenter Unit Tests', () => {
  const categoryPresenter = new CategoryPresenter({
    created_at: new Date(),
    description: 'description',
    id: '837b3b9b-1b1b-4b0b-8b0b-1b1b1b1b1b1b',
    is_active: true,
    name: 'name',
  });
  describe('constructor', () => {
    it('should set values', () => {
      const presenter = new CategoryCollectionPresenter({
        current_page: 1,
        items: [categoryPresenter],
        last_page: 3,
        per_page: 2,
        total: 4,
      });

      expect(presenter['paginationPresenter']).toBeInstanceOf(
        PaginationPresenter,
      );
      expect(presenter['paginationPresenter'].current_page).toBe(1);
      expect(presenter['paginationPresenter'].per_page).toBe(2);
      expect(presenter['paginationPresenter'].last_page).toBe(3);
      expect(presenter['paginationPresenter'].total).toBe(4);
      expect(presenter.meta).toEqual(presenter['paginationPresenter']);
      expect(presenter.data).toEqual([categoryPresenter]);
    });
  });
});
