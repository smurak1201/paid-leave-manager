export interface LeaveGrant {
  grantDate: string; // 付与日（YYYY-MM-DD）
  days: number;      // 付与日数
  usedDates: string[]; // この付与分から消化した日付
}

export interface Employee {
  id: string;
  lastName: string;
  firstName: string;
  joinedAt: string; // 入社年月日 (YYYY-MM-DD)
  grants?: LeaveGrant[]; // 年度ごとの付与履歴
  total: number;
  used: number;
  leaveDates: string[]; // 有給取得日（YYYY-MM-DD）
  carryOver?: number; // 前年からの繰越日数（省略時は0）
}
