// =====================================================
// employeeApi.ts
// -----------------------------------------------------
// このファイルは「従業員関連API通信ロジック」を一元管理します。
// 主な役割:
//   - 従業員一覧取得・追加・編集・削除APIの呼び出し
//   - 型安全・エラーハンドリング・API設計の共通化
// 設計意図:
//   - API通信の共通化・型安全・保守性向上
//   - UI/ロジックからAPI通信の詳細を隠蔽し、再利用性・可読性向上
// 使い方:
//   - 各関数をimportして従業員データの取得・追加・編集・削除を行う
//   - BASE_URLは開発用に明示
// =====================================================

import { apiGet, apiPost } from "../api";
import type { Employee } from "../types/employee";

// 開発用: バックエンドAPIのURLを明示
const BASE_URL = "http://172.18.119.226:8000/api/employees";

/**
 * 従業員一覧を取得
 * @returns Employee[]
 */
export async function fetchEmployees(): Promise<Employee[]> {
  return apiGet<Employee[]>(BASE_URL);
}

/**
 * 従業員を追加
 * @param form - idを除く従業員情報（employeeId必須, string型）
 */
export async function addEmployee(form: Omit<Employee, "id">): Promise<void> {
  await apiPost(BASE_URL, { ...form, employee_id: form.employeeId, mode: "add" });
}

/**
 * 従業員情報を編集
 * @param form - 編集後の従業員情報（employeeId必須, string型）
 */
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
