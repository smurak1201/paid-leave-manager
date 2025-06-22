// =============================
// useLeaveDates.ts
// 有給取得日編集用カスタムフック
// =============================
//
// 役割:
// ・有給取得日編集の状態・ロジック・バリデーション共通化
//
// 設計意図:
// ・UI部品から分離し、再利用性・保守性・可読性向上
//
// 使い方:
// - useLeaveDates(employee) を呼び出し、返却されるメソッドをコンポーネント内で利用
// - employeeには編集対象の従業員データを渡す
// - handleAddDate, handleEditDate, handleSaveDate, handleDeleteDate
//   をそれぞれの日付追加・編集・保存・削除処理に紐付け
//
// バリデーションルール:
// - 日付はYYYY-MM-DD形式
// - 既存の有給取得日と重複不可
// - 入力日付は従業員の入社日以降である必要あり
//
// 型定義:
// - Employee: 従業員データの型
// - useLeaveDates: 有給取得日編集用カスタムフック
//
// カスタムフック内で使用する状態:
// - editDateIdx: 現在編集中の日付のインデックス
// - dateInput: 入力中の日付
//
// 各種ロジック:
// - handleAddDate: 日付追加処理
// - handleEditDate: 編集開始処理
// - handleSaveDate: 編集保存処理
// - handleDeleteDate: 日付削除処理
//
// 注意点:
// - employeeがnullの場合、処理は何も行わない
// - 日付の状態更新はonUpdateコールバックを通じて親コンポーネントに通知
//
// 例外処理:
// - 不正な日付形式や論理エラーの場合、処理を中断し何も更新しない
//
// 参考:
// - ReactのuseStateを利用した状態管理
// - TypeScriptによる型安全なコーディング
//
// カスタムフック: 有給取得日編集用の状態・ロジックを管理します。
 // モーダルの入力値や編集中インデックス、追加・編集・削除のロジックを一元化。
import { useState } from "react";
import type { Employee } from "../components/employee/types";

export function useLeaveDates(employee: Employee | null) {
  const [editDateIdx, setEditDateIdx] = useState<number | null>(null);
  const [dateInput, setDateInput] = useState<string>("");

  // 日付追加時のバリデーション・状態更新
  const handleAddDate = (date: string, onUpdate: (dates: string[]) => void) => {
    if (!employee) return;
    const newDate = date;
    if (
      !newDate.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) ||
      employee.leaveDates.includes(newDate) ||
      newDate < employee.joinedAt
    )
      return;
    onUpdate([...employee.leaveDates, newDate]);
    setDateInput("");
  };

  // 編集開始時の処理
  const handleEditDate = (idx: number) => {
    if (!employee) return;
    setEditDateIdx(idx);
    setDateInput(employee.leaveDates[idx]);
  };

  // 編集保存時のバリデーション・状態更新
  const handleSaveDate = (onUpdate: (dates: string[]) => void) => {
    if (!employee || editDateIdx === null) return;
    const newDate = dateInput;
    if (
      !newDate.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) ||
      employee.leaveDates.includes(newDate) ||
      newDate < employee.joinedAt
    )
      return;
    onUpdate(
      employee.leaveDates.map((d, i) => (i === editDateIdx ? newDate : d))
    );
    setEditDateIdx(null);
    setDateInput("");
  };

  // 日付削除時の処理
  const handleDeleteDate = (idx: number, onUpdate: (dates: string[]) => void) => {
    if (!employee) return;
    onUpdate(employee.leaveDates.filter((_, i) => i !== idx));
    setEditDateIdx(null);
    setDateInput("");
  };

  return {
    editDateIdx,
    setEditDateIdx,
    dateInput,
    setDateInput,
    handleAddDate,
    handleEditDate,
    handleSaveDate,
    handleDeleteDate,
  };
}
