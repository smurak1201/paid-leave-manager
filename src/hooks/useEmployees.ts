// useEmployees.ts: 従業員データ取得・管理用カスタムフック
import { useState, useEffect, useCallback } from "react";
import type { Employee } from "../types/employee";
import {
  fetchEmployees,
  addEmployee,
  editEmployee,
  deleteEmployee,
} from "../api/employeeApi";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (e: any) {
      setError(e.message || "従業員データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (form: Omit<Employee, "id">) => {
    await addEmployee(form);
    await load();
  };
  const edit = async (form: Employee) => {
    await editEmployee(form);
    await load();
  };
  const remove = async (id: number) => {
    await deleteEmployee(id);
    await load();
  };

  return { employees, loading, error, reload: load, add, edit, remove };
}
