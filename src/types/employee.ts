// =====================================================
// employee.ts
// -----------------------------------------------------
// 【有給休暇管理アプリ】従業員データ型定義
// -----------------------------------------------------
// ▼主な役割
//   - Employee型など従業員関連の型定義
// ▼設計意図
//   - 型安全・保守性・可読性の向上
// ▼使い方
//   - importして型注釈・props等に利用
// =====================================================

export interface Employee {
  id: number;             // DB主キー
  employeeId: string;    // 業務用従業員ID（string型で管理）
  lastName: string;      // 姓
  firstName: string;     // 名
  joinedAt: string;      // 入社年月日 (YYYY-MM-DD)
}

/**
 * 有給付与マスターAPI型
 */
export interface LeaveGrantMaster {
  id: number;
  months: number;
  days: number;
}
