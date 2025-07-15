// =====================================================
// employeeApi.ts
// -----------------------------------------------------
// 【有給休暇管理アプリ】従業員データAPI通信ロジック
// -----------------------------------------------------
// ▼主な役割
//   - 従業員一覧・追加・編集・削除APIの呼び出し
// ▼設計意図
//   - API通信の共通化・型安全・UIからの分離
// ▼使い方
//   - 各関数をimportして従業員データ操作に利用
// =====================================================

// ===== import: API共通関数・型定義 =====
import { apiGet, apiPost } from "../api"; // API通信共通ラッパー
import type { Employee } from "../types/employee"; // 従業員型

// ===== APIエンドポイント定数 =====
const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/api/employees`;

// ===== API呼び出し関数群 =====

/** 従業員一覧を取得 */
export async function fetchEmployees(): Promise<Employee[]> {
  return apiGet<Employee[]>(BASE_URL);
}

/** 従業員を追加 */
export async function addEmployee(form: Omit<Employee, "id">): Promise<void> {
  await apiPost(BASE_URL, { ...form, employee_id: form.employeeId, mode: "add" });
}

/** 従業員情報を編集 */
export async function editEmployee(form: Employee, headers?: Record<string, string>): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/${form.employeeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(headers || {}),
      },
      body: JSON.stringify({
        employee_id: form.employeeId,
        last_name: form.lastName,
        first_name: form.firstName,
        joined_at: form.joinedAt,
      }),
      mode: "cors",
      credentials: "include",
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`APIエラー: ${res.status} ${errorText}`);
    }
  } catch (error) {
    alert(error);
    throw error;
  }
}

/**
 * 従業員を削除
 * @param employeeId - 削除対象の従業員ID（string型）
 */
export async function deleteEmployee(employeeId: string, headers?: Record<string, string>): Promise<void> {
  const res = await fetch(`${BASE_URL}/${employeeId}`, {
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
