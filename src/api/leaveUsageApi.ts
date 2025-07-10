// =====================================================
// leaveUsageApi.ts
// -----------------------------------------------------
// 【有給休暇管理アプリ】有給消化履歴API通信ロジック
// -----------------------------------------------------
// ▼主な役割
//   - 有給消化履歴の一覧取得・追加・削除APIの呼び出し
// ▼設計意図
//   - API通信の共通化・型安全・UIからの分離
// ▼使い方
//   - 各関数をimportして有給消化履歴データ操作に利用
// =====================================================

// ===== import: API共通関数・型定義 =====
import { apiGet, apiPost } from "../api"; // API通信共通ラッパー
import type { LeaveUsage } from "../types/leaveUsage"; // 有給消化履歴型

// ===== APIエンドポイント定数 =====
const BASE_URL = "http://172.18.119.226:8000/api/leave-usages";

// ===== API呼び出し関数群 =====

/** 有給消化履歴一覧を取得 */
export async function fetchLeaveUsages(): Promise<LeaveUsage[]> {
  return apiGet<LeaveUsage[]>(BASE_URL);
}

/** 有給消化履歴を追加 */
export async function addLeaveUsage(
  employeeId: string,
  usedDate: string,
  headers?: Record<string, string>
): Promise<void> {
  await apiPost(BASE_URL, { employee_id: employeeId, used_date: usedDate }, headers);
}

/** 有給消化履歴を削除（id指定） */
export async function deleteLeaveUsage(id: number, headers?: Record<string, string>): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      ...(headers || {}),
    },
    mode: "cors",
    credentials: "include",
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`APIエラー: ${res.status} ${errorText}`);
  }
}
