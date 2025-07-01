// leaveUsageApi.ts: 有給消化履歴関連API通信ロジック
// すべてのAPI通信はこのファイルで一元管理します。
// 型はsrc/types/leaveUsage.tsからインポートし、
// idではなくemployeeIdをビジネスキーとして利用します。
import { apiGet, apiPost } from "../api";
import type { LeaveUsage } from "../types/leaveUsage";

const BASE_URL = "/api/leave-usages";

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
  await apiPost(BASE_URL, { employee_id: employeeId, used_date: usedDate });
}

/**
 * 有給消化履歴を削除（RESTful: id指定）
 * @param id - 削除対象の有給消化履歴ID
 */
export async function deleteLeaveUsage(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    mode: "cors",
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`APIエラー: ${res.status} ${errorText}`);
  }
}
