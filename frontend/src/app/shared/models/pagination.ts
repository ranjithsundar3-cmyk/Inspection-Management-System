export interface PageResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}