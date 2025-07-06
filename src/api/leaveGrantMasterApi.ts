// =====================================================
// leaveGrantMasterApi.ts
// -----------------------------------------------------
// このファイルは「有給付与マスターAPI通信ロジック」を一元管理します。
// 主な役割:
//   - 有給付与マスター（基準値）の一覧取得・追加・編集・削除APIの呼び出し
//   - 型安全・エラーハンドリング・API設計の共通化
// 設計意図:
//   - API通信の共通化・型安全・保守性向上
//   - UI/ロジックからAPI通信の詳細を隠蔽し、再利用性・可読性向上
// 使い方:
//   - 各関数をimportして有給付与マスターデータの取得・追加・編集・削除を行う
// =====================================================

import { apiGet, apiPost } from "../api";

export interface LeaveGrantMaster {
  id: number;
  months: number;
  days: number;
}

const BASE_URL = "http://172.18.119.226:8000/api/leave-grant-master";

/**
 * 有給付与マスター一覧を取得
 * @returns LeaveGrantMaster[]
 */
export async function fetchLeaveGrantMaster(): Promise<LeaveGrantMaster[]> {
  return apiGet<LeaveGrantMaster[]>(BASE_URL);
}

/**
 * 有給付与マスターを追加
 * @param data - months, days
 */
export async function addLeaveGrantMaster(data: Omit<LeaveGrantMaster, "id">): Promise<void> {
  await apiPost(BASE_URL, data);
}

/**
 * 有給付与マスターを編集
 * @param id - 編集対象ID
 * @param data - months, days
 */
export async function editLeaveGrantMaster(id: number, data: Omit<LeaveGrantMaster, "id">): Promise<void> {
  await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    mode: "cors",
    credentials: "include",
  });
}

/**
 * 有給付与マスターを削除
 * @param id - 削除対象ID
 */
export async function deleteLeaveGrantMaster(id: number): Promise<void> {
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    mode: "cors",
    credentials: "include",
  });
}
