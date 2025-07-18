// =====================================================
// leaveUsage.ts
// -----------------------------------------------------
// 【有給休暇管理アプリ】有給取得履歴データ型定義
// -----------------------------------------------------
// ▼主な役割
//   - LeaveUsage型など有給履歴関連の型定義
// ▼設計意図
//   - 型安全・保守性・可読性の向上
// ▼使い方
//   - importして型注釈・props等に利用
// =====================================================

export interface LeaveUsage {
  id: number; // DB主キー
  employeeId: string; // string型で統一
  usedDate: string; // YYYY-MM-DD
}
