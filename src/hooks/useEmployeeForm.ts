// =====================================================
// useEmployeeForm.ts
// -----------------------------------------------------
// 【有給休暇管理アプリ】従業員フォーム用カスタムフック
// -----------------------------------------------------
// ▼主な役割
//   - 入力値・バリデーション・状態管理
// ▼設計意図
//   - フォームロジックの責務分離・再利用性重視
// ▼使い方
//   - EmployeeModal等からimportして利用
// =====================================================

import { useState } from "react";
import type { Employee } from "../types/employee";

/**
 * useEmployeeForm
 * - 従業員フォームの状態・バリデーション共通化
 * - UI部品から分離し、再利用性・保守性・可読性向上
 *
 * @param initial 初期値（従業員データ）
 * @returns form: 入力値, setForm: 値更新関数, handleChange: 入力イベントハンドラ
 */
export function useEmployeeForm(initial: Employee) {
  const [form, setForm] = useState<Employee>(initial); // 入力値

  // 入力値変更時の状態更新
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "employeeId") {
      setForm((prev) => ({ ...prev, employeeId: value })); // employeeIdはstring型で管理
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  return { form, setForm, handleChange };
}
