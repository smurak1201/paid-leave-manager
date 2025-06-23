// leaveSummaryApi.ts: 有給サマリー取得API通信ロジック
// すべてのAPI通信はこのファイルで一元管理します。
// idではなくemployeeIdをビジネスキーとして利用します。
import { apiGet } from "../api";

export interface LeaveSummary {
  employeeId: string; // string型に統一
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

const BASE_URL = "http://localhost/paid_leave_manager/leave_summary.php";

/**
 * 有給サマリーを取得
 * @param employeeId - 対象従業員ID（string型）
 * employeeIdはAPI送信時にint型へ変換
 * @returns LeaveSummary
 */
export async function fetchLeaveSummary(employeeId: string): Promise<LeaveSummary> {
  return apiGet<LeaveSummary>(`${BASE_URL}?employee_id=${Number(employeeId)}`);
}
