// leaveUsageApi.ts: 有給消化履歴関連API通信ロジック
// すべてのAPI通信はこのファイルで一元管理します。
// 型はsrc/types/leaveUsage.tsからインポートし、
// idではなくemployeeIdをビジネスキーとして利用します。
import { apiGet, apiPost } from "../api";
import type { LeaveUsage } from "../types/leaveUsage";

const BASE_URL = "http://localhost/paid_leave_manager/leave_usages.php";
const ADD_URL = "http://localhost/paid_leave_manager/leave_usage_add.php";
const DELETE_URL = "http://localhost/paid_leave_manager/leave_usage_delete.php";

/**
 * 有給消化履歴一覧を取得
 * @returns LeaveUsage[]
 */
export async function fetchLeaveUsages(): Promise<LeaveUsage[]> {
  return apiGet<LeaveUsage[]>(BASE_URL);
}

/**
 * 有給消化履歴を追加
 * @param employeeId - 対象従業員ID（number型）
 * @param usedDate - 消化日
 */
export async function addLeaveUsage(employeeId: number, usedDate: string): Promise<void> {
  await apiPost(ADD_URL, { employee_id: employeeId, used_date: usedDate });
}

/**
 * 有給消化履歴を削除
 * @param employeeId - 対象従業員ID（number型）
 * @param usedDate - 消化日
 * ※PK(id)でなくビジネスキーで削除する設計
 */
export async function deleteLeaveUsage(employeeId: number, usedDate: string): Promise<void> {
  await apiPost(DELETE_URL, { employee_id: employeeId, used_date: usedDate });
}
