// leaveUsageApi.ts: 有給消化履歴関連API通信ロジック
import { apiGet, apiPost } from "../api";
import type { LeaveUsage } from "../types/leaveUsage";

const BASE_URL = "http://localhost/paid_leave_manager/leave_usages.php";
const ADD_URL = "http://localhost/paid_leave_manager/leave_usage_add.php";
const DELETE_URL = "http://localhost/paid_leave_manager/leave_usage_delete.php";

export async function fetchLeaveUsages(): Promise<LeaveUsage[]> {
  return apiGet<LeaveUsage[]>(BASE_URL);
}

export async function addLeaveUsage(employeeId: number, usedDate: string): Promise<void> {
  await apiPost(ADD_URL, { employee_id: employeeId, used_date: usedDate });
}

export async function deleteLeaveUsage(id: number): Promise<void> {
  await apiPost(DELETE_URL, { id });
}
