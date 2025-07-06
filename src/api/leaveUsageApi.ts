// =====================================================
// leaveUsageApi.ts
// -----------------------------------------------------
// このファイルは「有給消化履歴API通信ロジック」を一元管理します。
// 主な役割:
//   - 有給消化履歴の一覧取得・追加・削除APIの呼び出し
//   - 型安全・エラーハンドリング・API設計の共通化
// 設計意図:
//   - API通信の共通化・型安全・保守性向上
//   - UI/ロジックからAPI通信の詳細を隠蔽し、再利用性・可読性向上
// 使い方:
//   - 各関数をimportして有給消化履歴データの取得・追加・削除を行う
// =====================================================

import { apiGet, apiPost } from "../api";
import type { LeaveUsage } from "../types/leaveUsage";

const BASE_URL = "http://172.18.119.226:8000/api/leave-usages";

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
    credentials: "include",
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`APIエラー: ${res.status} ${errorText}`);
  }
}
