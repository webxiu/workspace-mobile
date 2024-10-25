/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 09:53:08
 * @Last Modified by:   lixiuhai
 * @Last Modified time: 2023-06-23 09:53:08
 */
export interface AuditTaskType {
  limit: number;
  page?: number;
  pageNo?: number;
  searchFrom?: number;
  taskState?: number;
  searchKey?: string;
}

export const TabActiveColor = "#1989fa";
