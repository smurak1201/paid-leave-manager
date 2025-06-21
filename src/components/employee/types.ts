export interface Employee {
  id: string;
  lastName: string;
  firstName: string;
  joinedAt: string; // 入社年月日 (YYYY-MM-DD)
  total: number;
  used: number;
  leaveDates: string[]; // 有給取得日（YYYY-MM-DD）
}
