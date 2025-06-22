// =============================
// useEmployeeForm.ts
// 従業員フォーム用カスタムフック
// =============================
//
// このファイルは従業員追加・編集フォームの状態・バリデーションを共通化するカスタムフックです。
// - フォーム入力値・バリデーションエラーの状態管理
// - props/stateの流れを「idのみ受け取り、データ参照はAppのstateから行う」形に統一
// - 型定義・バリデーションロジックの共通化
//
// 設計意図:
// - フォーム状態・バリデーションをUI部品から分離し、再利用性・保守性を向上
// - 初学者でも理解しやすいように全体の流れ・型の意味・用途を日本語コメントで明記
//
// 使い方:
// - useEmployeeFormを呼び出し、返却された状態・関数をフォームコンポーネントで利用
// - 初期値、従業員一覧、編集中のIDを引数に渡す
//
// 例:
// const { form, idError, handleChange } = useEmployeeForm(initialEmployee, employeeList, editingEmployeeId);
//
// 型定義:
// - Employee: 従業員情報の型
// - handleChange: 入力値変更時のイベントハンドラ
//
// バリデーション:
// - 従業員コード(id)は必須、半角数字、重複禁止
// - 入力値変更時にリアルタイムでバリデーションチェック
//
// カスタムフック: 従業員フォームの状態・バリデーション共通化カスタムフック
// Appから渡された初期値・従業員一覧・編集中IDを元に、入力値やエラー状態を一元管理します。
import { useState } from "react";
import type { Employee } from "../components/employee/types";
import { calcLeaveDays } from "../components/employee/utils";

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
