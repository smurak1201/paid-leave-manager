// employee.ts: 従業員データ型定義
// employeeIdはstring型で管理し、API送信時にint型へ変換するのがベストプラクティス
export interface Employee {
  id: number;             // DB主キー
  employeeId: string;    // 業務用従業員ID（string型で管理）
  lastName: string;      // 姓
  firstName: string;     // 名
  joinedAt: string;      // 入社年月日 (YYYY-MM-DD)
}
