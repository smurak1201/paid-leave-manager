// employee.ts: 従業員データ型定義
export interface Employee {
  id: number;             // DB主キー
  employeeId: number;     // 業務用従業員ID
  lastName: string;       // 姓
  firstName: string;      // 名
  joinedAt: string;       // 入社年月日 (YYYY-MM-DD)
}
