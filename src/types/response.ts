export type successResponse<T> = T & {
    message: 'success';
  };
  
export type PaginationResponse<T = unknown> = T & {
    message: 'success';
    pagination: { currentPage: number; totalPages: number; resultCount: number };
  };