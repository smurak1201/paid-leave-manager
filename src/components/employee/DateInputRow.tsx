// =====================================================
// DateInputRow.tsx
// -----------------------------------------------------
// 【有給休暇管理アプリ】有給日付入力用小コンポーネント
// -----------------------------------------------------
// ▼主な役割
//   - 有給取得日を入力・追加・編集するためのUI部品
//   - 入力値・編集状態・バリデーション・追加/保存ボタンの有効/無効などをpropsで制御
// ▼設計意図
//   - 入力欄の責務を分離し、モーダル本体の可読性・保守性を向上
//   - 初学者でも理解しやすいように、propsやロジックの意味を明記
// ▼使い方
//   - LeaveDatesModal等からpropsでデータ・操作関数を受け取る
// =====================================================

// ===== import: 外部ライブラリ =====
import { Box, Button } from "@chakra-ui/react";
import React, { useCallback, useMemo } from "react";

// ===== import: アイコン =====
import { Icons } from "./icons";

// ===============================
// ▼props型定義
// ===============================
interface DateInputRowProps {
  dateInput: string; // 入力中の日付文字列
  onChangeDateInput: (v: string) => void; // 入力値変更時のハンドラ
  onAddDate: (date: string) => void; // 追加ボタン押下時のハンドラ
  onSaveDate: () => void; // 編集保存ボタン押下時のハンドラ
  editDateIdx: number | null; // 編集中インデックス（nullなら追加モード）
  remainSimple: number; // 残日数（0なら追加不可）
  isReadOnly?: boolean; // 閲覧者権限用
}

/**
 * 有給日付入力行（追加・編集共通）
 */
export const DateInputRow: React.FC<DateInputRowProps> = ({
  dateInput,
  onChangeDateInput,
  onAddDate,
  onSaveDate,
  editDateIdx,
  remainSimple,
  isReadOnly,
}) => {
  // 日付入力欄の値が変わったときの処理
  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeDateInput(e.target.value);
      // 入力値が変わるたびに親へ通知
    },
    [onChangeDateInput]
  );

  // 追加ボタン押下時の処理
  const handleAddClick = useCallback(() => {
    if (
      editDateIdx === null &&
      dateInput.match(/^[\d]{4}-[\d]{2}-[\d]{2}$/) &&
      remainSimple > 0
    ) {
      onAddDate(dateInput);
    }
  }, [onAddDate, editDateIdx, remainSimple, dateInput]);

  // 追加・保存ボタンの活性/非活性判定
  const isSaveDisabled = useMemo(
    () => remainSimple === 0 || !dateInput.match(/^[\d]{4}-[\d]{2}-[\d]{2}$/),
    [remainSimple, dateInput]
  );

  return (
    <Box display="flex" gap={2} mb={4}>
      <input
        type="date"
        value={dateInput}
        onChange={handleDateChange}
        style={{
          border: "1px solid #B2F5EA",
          borderRadius: 6,
          padding: "6px 12px",
          fontSize: 16,
          outline: "none",
          width: "100%",
        }}
        maxLength={10}
      />
      {editDateIdx === null && (
        <Button
          colorScheme="teal"
          onClick={handleAddClick}
          px={4}
          minW={"auto"}
          disabled={isSaveDisabled || isReadOnly}
          cursor={isSaveDisabled || isReadOnly ? "not-allowed" : "pointer"}
          opacity={isReadOnly ? 0.5 : 1}
          _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
        >
          <Icons.Plus size={16} style={{ marginRight: 6 }} />
          追加
        </Button>
      )}
      {editDateIdx !== null && (
        <Button
          colorScheme="teal"
          onClick={onSaveDate}
          px={4}
          minW={"auto"}
          disabled={isSaveDisabled}
          cursor={isSaveDisabled ? "not-allowed" : "pointer"}
          _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
        >
          <Icons.Edit size={16} style={{ marginRight: 6 }} />
          保存
        </Button>
      )}
    </Box>
  );
};

// 不要なコメントや未使用props、未使用stateの削除
