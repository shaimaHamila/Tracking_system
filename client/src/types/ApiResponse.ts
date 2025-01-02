export interface ApiResponse<T = any> {
  succss: boolean;
  message: string;
  data?: T;
  meta?: {
    currentPage?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
    unseenNotifications?: number;
  };
}
