// employeeApi.ts: 従業員関連API通信ロジック
import { apiGet, apiPost } from "../api";
import type { Employee } from "../types/employee";

const BASE_URL = "http://localhost/paid_leave_manager/employees.php";

export async function fetchEmployees(): Promise<Employee[]> {
  return apiGet<Employee[]>(BASE_URL);
}

export async function addEmployee(form: Omit<Employee, "id">): Promise<void> {
  await apiPost(BASE_URL, { ...form, mode: "add" });
}

export async function editEmployee(form: Employee): Promise<void> {
  await apiPost(BASE_URL, { ...form, mode: "edit" });
}

export async function deleteEmployee(id: number): Promise<void> {
  await apiPost(BASE_URL, { id, mode: "delete" });
}
