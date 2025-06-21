export interface Employee {
  id: string;
  lastName: string;
  firstName: string;
  total: number;
  used: number;
  leaveDates: string[]; // 有給取得日（YYYY-MM-DD）
}
