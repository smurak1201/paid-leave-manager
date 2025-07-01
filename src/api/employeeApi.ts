// employeeApi.ts: 従業員関連API通信ロジック
// すべてのAPI通信はこのファイルで一元管理します。
// 型はsrc/types/employee.tsからインポートし、
// idではなくemployeeIdをビジネスキーとして利用します。
import { apiGet, apiPost } from "../api";
import type { Employee } from "../types/employee";

const BASE_URL = "/api/employees";

/**
 * 従業員一覧を取得
 * @returns Employee[]
 */
export async function fetchEmployees(): Promise<Employee[]> {
  return apiGet<Employee[]>(BASE_URL);
}

/**
 * 従業員を追加
 * @param form - idを除く従業員情報（employeeId必須, number型）
 */
export async function addEmployee(form: Omit<Employee, "id">): Promise<void> {
  await apiPost(BASE_URL, { ...form, employee_id: form.employeeId, mode: "add" });
}

/**
 * 従業員情報を編集
 * @param form - 編集後の従業員情報（id, employeeId含む, number型）
 */
export async function editEmployee(form: Employee): Promise<void> {
  await fetch(`${BASE_URL}/${form.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      employee_id: form.employeeId,
      last_name: form.lastName,
      first_name: form.firstName,
      joined_at: form.joinedAt,
    }),
  });
}

/**
 * 従業員を削除
 * @param employeeId - 削除対象の従業員ID（number型）
 */
export async function deleteEmployee(employeeId: number): Promise<void> {
  await apiPost(BASE_URL, { employee_id: employeeId, mode: "delete" });
}

// エラーハンドリング例（必要に応じて各関数でtry-catchを追加してください）
// try {
//   await addEmployee(form);
// } catch (error) {
//   alert("従業員の追加に失敗しました");
// }
