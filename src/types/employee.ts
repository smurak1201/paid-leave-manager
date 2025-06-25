// =============================
// employee.ts
// 従業員データ型定義
// =============================
//
// 役割:
// ・従業員情報（ID・氏名・入社日など）を表現する型
//
// 設計意図:
// ・型安全・保守性・可読性向上
//
// import分類:
// - 型定義のみ

export interface Employee {
  id: number;             // DB主キー
  employeeId: number;    // 業務用従業員ID（number型で管理）
  lastName: string;      // 姓
  firstName: string;     // 名
  joinedAt: string;      // 入社年月日 (YYYY-MM-DD)
}
