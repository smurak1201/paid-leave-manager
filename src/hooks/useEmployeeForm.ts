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

// ===== import: 外部ライブラリ =====
import { useState } from "react";

// ===== import: 型定義 =====
import type { Employee } from "../types/employee";

// =============================
// カスタムフック: useEmployeeForm
// 従業員フォームの状態・バリデーション共通化カスタムフック
// Appから渡された初期値・従業員一覧・編集中IDを元に、入力値やエラー状態を一元管理します。
// =============================
export function useEmployeeForm(initial: Employee) {
  const [form, setForm] = useState<Employee>(initial);

  // 入力値変更時の状態更新
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  return { form, setForm, handleChange };
}
