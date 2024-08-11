import Api from './api';
import { Category } from './categoryService';
import { Subniche } from './subnicheService';

export interface SearchResult {
  categories: Category[];
  subniches: Subniche[];
  totalPages: number;
}

const prefix = 'v1/search';

export const searchCategoriesAndSubniches = async (
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  sortField?: string,
  sortOrder?: string,
  importantFirst?: string
): Promise<SearchResult> => {
  const response = await Api.get<SearchResult>(`${prefix}/`, {
    params: {
      page,
      pageSize,
      search,
      sortField,
      sortOrder,
      importantFirst
    }
  });
  return response.data;
};
