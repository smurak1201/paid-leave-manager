// leaveSummaryApi.ts: 有給サマリー取得API通信ロジック
import { apiGet } from "../api";

export interface LeaveSummary {
  employeeId: number;
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

export async function fetchLeaveSummary(employeeId: number): Promise<LeaveSummary> {
  return apiGet<LeaveSummary>(`${BASE_URL}?employee_id=${employeeId}`);
}
