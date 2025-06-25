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
import React, { useMemo } from "react";

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
  onDeleteDate,
}) => {
  const memoizedDates = useMemo(() => {
    return dates.map((date, i) => {
      const [y, m, d] = date.split("-");
      const jpDate = `${y}年${m}月${d}日`;
      return {
        idx: i,
        date,
        jpDate,
      };
    });
  }, [dates]);

  return (
    <Box as="ul" pl={0} m={0}>
      {memoizedDates.map(({ idx, date, jpDate }) => (
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
          <Text fontSize="sm" fontFamily="inherit" color="black">
            {jpDate}
          </Text>
          {/* 編集ボタンは削除 */}
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
      ))}
    </Box>
  );
};

// LeaveDateListPropsのemployeeId等でemployeeIdをstring型で扱うように統一
// 既存のprops型定義・state・コールバック等でnumber型→string型に修正（types.tsに準拠）
