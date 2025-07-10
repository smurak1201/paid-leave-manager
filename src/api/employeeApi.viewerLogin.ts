import { apiGet } from "../api";
import type { Employee } from "../types/employee";

const BASE_URL = "http://172.18.119.226:8000/api/employees";

/**
 * 指定したemployeeIdの従業員情報を取得
 */
export async function fetchEmployeeById(employeeId: string): Promise<Employee | null> {
  const employees = await apiGet<Employee[]>(BASE_URL);
  return employees.find(e => e.employeeId === employeeId) || null;
}
