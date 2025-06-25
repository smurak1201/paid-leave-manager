// =============================
// useEmployees.ts
// 従業員データ取得・管理用カスタムフック
// =============================
//
// 役割:
// ・従業員一覧データの取得・追加・編集・削除・ローディング/エラー状態管理
//
// 設計意図:
// ・UI部品から分離し、再利用性・保守性・可読性向上
// ・API通信・状態管理・副作用処理を一元化
//
// import分類:
// - React本体・フック
// - 型定義
// - API通信関数

import { useState, useEffect, useCallback } from "react";
import type { Employee } from "../types/employee";
import {
  fetchEmployees,
  addEmployee,
  editEmployee,
  deleteEmployee,
} from "../api/employeeApi";

/**
 * useEmployees
 * - 従業員一覧データの取得・追加・編集・削除・ローディング/エラー状態管理を一元化
 * - UI部品から分離し、再利用性・保守性・可読性向上
 */
export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]); // 従業員一覧
  const [loading, setLoading] = useState(true); // ローディング状態
  const [error, setError] = useState<string>(""); // エラー内容

  // 従業員一覧をAPIから取得
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

  // 初回マウント時に従業員一覧を取得
  useEffect(() => {
    load();
  }, [load]);

  // 従業員追加
  const add = async (form: Omit<Employee, "id">) => {
    await addEmployee(form);
    await load();
  };
  // 従業員編集
  const edit = async (form: Employee) => {
    await editEmployee(form);
    await load();
  };
  // 従業員削除
  const remove = async (employeeId: number) => {
    await deleteEmployee(employeeId); // number型で渡す
    await load();
  };

  return { employees, loading, error, reload: load, add, edit, remove };
}
