// leaveUsage.ts: 有給消化履歴データ型定義
export interface LeaveUsage {
  id: number;
  employeeId: number; // number型に統一
  usedDate: string;
}
