// =====================================================
// leaveGrantMasterApi.ts
// -----------------------------------------------------
// 【有給休暇管理アプリ】有給付与マスターAPI通信ロジック
// -----------------------------------------------------
// ▼主な役割
//   - 有給付与マスター（基準値）の一覧取得・追加・編集・削除APIの呼び出し
// ▼設計意図
//   - API通信の共通化・型安全・UIからの分離
// ▼使い方
//   - 各関数をimportして有給付与マスターデータ操作に利用
// =====================================================

// ===== import: API共通関数 =====
import { apiGet, apiPost } from "../api"; // API通信共通ラッパー

// ===== 型定義 =====
export interface LeaveGrantMaster {
  id: number;
  months: number;
  days: number;
}

// ===== APIエンドポイント定数 =====
const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/api/leave-grant-master`;

// ===== API呼び出し関数群 =====

/** 有給付与マスター一覧を取得 */
export async function fetchLeaveGrantMaster(): Promise<LeaveGrantMaster[]> {
  return apiGet<LeaveGrantMaster[]>(BASE_URL);
}

/** 有給付与マスターを追加 */
export async function addLeaveGrantMaster(data: Omit<LeaveGrantMaster, "id">): Promise<void> {
  await apiPost(BASE_URL, data);
}

/** 有給付与マスターを編集 */
export async function editLeaveGrantMaster(id: number, data: Omit<LeaveGrantMaster, "id">, headers?: Record<string, string>): Promise<void> {
  await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: JSON.stringify(data),
    mode: "cors",
    credentials: "include",
  });
}

/** 有給付与マスターを削除（id指定） */
export async function deleteLeaveGrantMaster(id: number, headers?: Record<string, string>): Promise<void> {
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      ...(headers || {}),
    },
    mode: "cors",
    credentials: "include",
  });
}
