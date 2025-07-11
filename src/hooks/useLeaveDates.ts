// =====================================================
// useLeaveDates.ts
// -----------------------------------------------------
// 【有給休暇管理アプリ】有給取得日データ管理用カスタムフック
// -----------------------------------------------------
// ▼主な役割
//   - 有給取得日一覧の取得・状態管理
// ▼設計意図
//   - データ取得ロジックの責務分離・再利用性重視
// ▼使い方
//   - LeaveDatesModal等からimportして利用
// =====================================================

import { useState } from "react";
import type { Employee } from "../components/employee/types";

/**
 * useLeaveDates
 * @param employee 編集対象の従業員データ
 * @returns 編集用state・バリデーション・編集ロジック一式
 *
 * - LeaveDatesModal, LeaveDateList等で利用
 * - 日付追加・編集・削除・バリデーションを一元管理
 */
export function useLeaveDates(employee: Employee | null) {
  const [editDateIdx, setEditDateIdx] = useState<number | null>(null); // 編集中インデックス
  const [dateInput, setDateInput] = useState<string>(""); // 入力中日付

  // 日付追加時のバリデーション・状態更新
  const handleAddDate = (date: string, onUpdate: (dates: string[]) => void, currentDates: string[] = []) => {
    if (!employee) return;
    const newDate = date;
    // バリデーション: 日付形式・重複・入社日より前
    if (
      !newDate.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) ||
      newDate < employee.joinedAt
    )
      return;
    onUpdate([...currentDates, newDate]);
    setDateInput("");
  };

  // 編集開始時の処理
  const handleEditDate = (idx: number, currentDates: string[] = []) => {
    if (!employee) return;
    setEditDateIdx(idx);
    setDateInput(currentDates[idx] ?? "");
  };

  // 編集保存時のバリデーション・状態更新
  const handleSaveDate = (onUpdate: (dates: string[]) => void, currentDates: string[] = []) => {
    if (!employee || editDateIdx === null) return;
    const newDate = dateInput;
    // バリデーション: 日付形式・重複・入社日より前
    if (
      !newDate.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) ||
      newDate < employee.joinedAt
    )
      return;
    const updated = currentDates.map((d, i) => (i === editDateIdx ? newDate : d));
    onUpdate(updated);
    setEditDateIdx(null);
    setDateInput("");
  };

  // 日付削除時の処理
  const handleDeleteDate = (idx: number, onUpdate: (dates: string[]) => void, currentDates: string[] = []) => {
    if (!employee) return;
    const updated = currentDates.filter((_, i) => i !== idx);
    onUpdate(updated);
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
