// =============================
// leaveUsage.ts
// 有給消化履歴データ型定義
// =============================
//
// 役割:
// ・有給消化履歴（いつ誰が何日使ったか）を表現する型
//
// 設計意図:
// ・型安全・保守性・可読性向上
//
// import分類:
// - 型定義のみ

export interface LeaveUsage {
  id: number; // DB主キー
  employeeId: number; // number型で統一
  usedDate: string; // YYYY-MM-DD
}
