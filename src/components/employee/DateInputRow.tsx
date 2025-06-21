import { Box, Button } from "@chakra-ui/react";
import { Icons, inputDateStyle } from "./icons";
import React from "react";

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
}) => (
  <Box display="flex" gap={2} mb={4}>
    <input
      type="date"
      value={dateInput}
      onChange={(e) => {
        onChangeDateInput(e.target.value);
        if (
          editDateIdx === null &&
          e.target.value.match(/^[\d]{4}-[\d]{2}-[\d]{2}$/) &&
          remainSimple > 0
        ) {
          onAddDate(e.target.value);
        }
      }}
      style={inputDateStyle}
      maxLength={10}
    />
    {editDateIdx !== null && (
      <Button
        colorScheme="teal"
        onClick={onSaveDate}
        px={4}
        minW={"auto"}
        disabled={
          remainSimple === 0 || !dateInput.match(/^[\d]{4}-[\d]{2}-[\d]{2}$/)
        }
        cursor={
          remainSimple === 0 || !dateInput.match(/^[\d]{4}-[\d]{2}-[\d]{2}$/)
            ? "not-allowed"
            : "pointer"
        }
        _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
      >
        <Icons.Edit size={16} style={{ marginRight: 6 }} />
        保存
      </Button>
    )}
  </Box>
);
