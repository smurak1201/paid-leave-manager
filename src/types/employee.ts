// employee.ts: 従業員データ型定義
// employeeIdはnumber型で管理し、API送信時もnumber型で渡す
export interface Employee {
  id: number;             // DB主キー
  employeeId: number;    // 業務用従業員ID（number型で管理）
  lastName: string;      // 姓
  firstName: string;     // 名
  joinedAt: string;      // 入社年月日 (YYYY-MM-DD)
}
