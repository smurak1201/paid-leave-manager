

// =====================================================
// employeeSummary.ts
// -----------------------------------------------------
// 【有給休暇管理アプリ】従業員ごとの有給休暇サマリー型定義
// -----------------------------------------------------
// ▼主な役割
//   - 従業員IDごとの有給付与・消化・残数・付与履歴などを集約
// ▼設計意図
//   - 型安全・保守性・可読性の向上
// ▼使い方
//   - App.tsxやサマリー表示系コンポーネントでimportして利用
// =====================================================

export type EmployeeSummary = {
  employeeId: string; // 従業員ID
  grantThisYear: number; // 今年の付与日数
  carryOver: number; // 繰越日数
  used: number; // 今年使用した日数
  remain: number; // 残り日数
  usedDates: string[]; // 今年使用した日付のリスト
  grantDetails?: Array<{
    grantDate: string; // 付与日
    days: number; // 付与日数
    used: number; // 使用済み日数
    remain: number; // 残り日数
    usedDates: string[]; // 使用した日付のリスト
  }>;
};
