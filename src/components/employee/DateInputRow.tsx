// =============================
// DateInputRow.tsx
// 有給日付入力用小コンポーネント
// =============================
//
// このファイルは有給日付の入力欄UI部品です。
// - propsとして日付値・編集状態・ハンドラ等を受け取る
// - UI部品の小コンポーネント化・責務分離
//
// 設計意図:
// - 入力欄の責務を分離し、モーダル本体の可読性・保守性を向上
// - 初学者でも理解しやすいように全体の流れ・propsの意味を日本語コメントで明記
//

// 日付入力行のUI部品。追加・編集どちらにも使える汎用コンポーネントです。
// 入力値・バリデーション・ボタンの有効/無効などをpropsで制御します。
import { Box, Button } from "@chakra-ui/react";
import { Icons } from "./icons";
import React, { useCallback, useMemo } from "react";

interface DateInputRowProps {
  dateInput: string;
  onChangeDateInput: (v: string) => void;
  onAddDate: (date: string) => void;
  onSaveDate: () => void;
  editDateIdx: number | null;
  remainSimple: number;
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
}) => {
  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeDateInput(e.target.value);
      // ここでonAddDateは呼ばない（追加ボタンでのみ追加）
    },
    [onChangeDateInput]
  );

  const handleAddClick = useCallback(() => {
    if (
      editDateIdx === null &&
      dateInput.match(/^[\d]{4}-[\d]{2}-[\d]{2}$/) &&
      remainSimple > 0
    ) {
      onAddDate(dateInput);
    }
  }, [onAddDate, editDateIdx, remainSimple, dateInput]);

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
          disabled={isSaveDisabled}
          cursor={isSaveDisabled ? "not-allowed" : "pointer"}
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
