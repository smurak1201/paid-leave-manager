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
//
// 使い方:
// - useEmployeeFormを呼び出し、返却された状態・関数をフォームコンポーネントで利用
// - 初期値、従業員一覧、編集中のIDを引数に渡す
//
// 例:
// const { form, idError, handleChange } = useEmployeeForm(initialEmployee, employeeList, editingEmployeeId);
//
// ===== import: 外部ライブラリ =====
import { useState } from "react";

// ===== import: 型定義 =====
import type { Employee } from "../components/employee/types";

// ===== import: ユーティリティ =====
import { calcLeaveDays } from "../components/employee/utils";

// =============================
// カスタムフック: useEmployeeForm
// 従業員フォームの状態・バリデーション共通化カスタムフック
// Appから渡された初期値・従業員一覧・編集中IDを元に、入力値やエラー状態を一元管理します。
// =============================
export function useEmployeeForm(initial: Employee, employees: Employee[], activeEmployeeId: number | null) {
  const [form, setForm] = useState<Employee>(initial);
  const [idError, setIdError] = useState("");

  // 入力値変更時のバリデーション・状態更新
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "id") {
      // 入力値が空ならNaN、そうでなければ数値化
      const numValue = value === "" ? NaN : Number(value);
      setForm((prev) => ({ ...prev, id: numValue } as Employee));
      // コードは半角数字のみ・重複禁止
      if (value && !/^[0-9]*$/.test(value)) {
        setIdError("従業員コードは半角数字のみ入力できます");
      } else if (
        value &&
        employees.some(
          (emp) => emp.id === numValue && (activeEmployeeId === null || emp.id !== activeEmployeeId)
        )
      ) {
        setIdError("従業員コードが重複しています");
      } else if (!value) {
        setIdError("従業員コードは必須です");
      } else {
        setIdError("");
      }
      return;
    }
    setForm((prev) => {
      let next = {
        ...prev,
        [name]: name === "total" || name === "used" ? Number(value) : value,
      };
      if (name === "joinedAt") {
        next.total = calcLeaveDays(value);
      }
      return next;
    });
  };

  return { form, setForm, idError, setIdError, handleChange };
}
