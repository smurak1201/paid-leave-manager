// =============================
// LeaveDateList.tsx
// 有給取得日リスト表示用コンポーネント
// =============================
//
// 役割:
// ・有給取得日リストの表示・編集・削除ボタンUI
//
// 設計意図:
// ・型安全・責務分離・UI/UX・可読性重視

// ===== import: 外部ライブラリ =====
import { Box, Button, Text } from "@chakra-ui/react";
import React from "react";

// ===== import: 型定義 =====
import type { LeaveDateListProps } from "./types";

// ===== import: アイコン =====
import { Icons } from "./icons";

/**
 * 有給取得日リスト部品
 * - props型はtypes.tsで一元管理
 * - UI/UX・責務分離・コメント充実
 */
export const LeaveDateList: React.FC<LeaveDateListProps> = ({
  dates,
  editDateIdx,
  dateInput,
  onChangeDateInput,
  onEditDate,
  onDeleteDate,
  inputDateSmallStyle,
  pagedDates,
  currentPage,
  ITEMS_PER_PAGE,
}) => (
  <Box as="ul" pl={0} m={0}>
    {pagedDates.map((date, i) => {
      const idx = (currentPage - 1) * ITEMS_PER_PAGE + i;
      const [y, m, d] = date.split("-");
      const jpDate = `${y}年${m}月${d}日`;
      return (
        <Box
          as="li"
          key={date + idx}
          fontSize="md"
          color="teal.700"
          py={2}
          px={4}
          borderBottom={idx !== dates.length - 1 ? "1px solid" : undefined}
          borderColor="teal.50"
          borderRadius="md"
          mb={1}
          listStyleType="none"
          bg={idx % 2 === 1 ? "rgba(0, 128, 128, 0.06)" : "white"} // 奇数行に淡いteal系背景
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Text fontWeight="bold" minW="2em">
            {idx + 1}.
          </Text>
          {editDateIdx === idx ? (
            <input
              type="date"
              value={dateInput}
              onChange={(e) => onChangeDateInput(e.target.value)}
              style={inputDateSmallStyle}
              maxLength={10}
            />
          ) : (
            <Text fontSize="sm" fontFamily="inherit" color="black">
              {jpDate}
            </Text>
          )}
          <Button
            size="xs"
            variant="ghost"
            colorScheme="teal"
            minW={"auto"}
            px={2}
            onClick={() => onEditDate(idx)}
            aria-label="編集"
          >
            <Icons.Edit size={15} />
          </Button>
          <Button
            size="xs"
            variant="ghost"
            colorScheme="red"
            minW={"auto"}
            px={2}
            onClick={() => onDeleteDate(idx)}
            aria-label="削除"
          >
            <Icons.Trash2 size={15} />
          </Button>
        </Box>
      );
    })}
  </Box>
);
