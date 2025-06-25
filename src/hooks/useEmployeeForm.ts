// =============================
// useEmployeeForm.ts
// 従業員フォーム用カスタムフック
// =============================
//
// 役割:
// ・従業員追加・編集フォームの状態・バリデーション共通化
//
// 設計意図:
// ・UI部品から分離し、再利用性・保守性・可読性向上
// ・初学者が「どの関数がどこで使われるか」理解しやすいようコメント充実
//
// import分類:
// - React本体・フック
// - 型定義

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
      setForm((prev) => ({ ...prev, employeeId: value === "" ? NaN : Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  return { form, setForm, handleChange };
}
