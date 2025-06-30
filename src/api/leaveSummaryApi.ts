// leaveSummaryApi.ts: 有給サマリー取得API通信ロジック
// すべてのAPI通信はこのファイルで一元管理します。
// idではなくemployeeIdをビジネスキーとして利用します。
import { apiGet } from "../api";

export interface LeaveSummary {
  employeeId: number; // number型に統一
  grantThisYear: number;
  carryOver: number;
  used: number;
  remain: number;
  usedDates: string[];
  grantDetails?: Array<{
    grant_date: string;
    days: number;
    used: number;
    remain: number;
    used_dates: string[];
  }>;
}

const BASE_URL = "http://172.18.119.226:8000/api/leave-summary";

/**
 * 有給サマリーを取得
 * @param employeeId - 対象従業員ID（number型）
 * @returns LeaveSummary
 */
export async function fetchLeaveSummary(employeeId: number): Promise<LeaveSummary> {
  return apiGet<LeaveSummary>(`${BASE_URL}?employee_id=${employeeId}`);
}
