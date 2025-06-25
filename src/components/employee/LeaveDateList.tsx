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
import { AnimatePresence } from "framer-motion";

// ===== import: 型定義 =====
import type { LeaveDateListProps } from "./types";

// ===== import: アイコン =====
import { Icons } from "./icons";
import { FadeListItem } from "./FadeListItem";

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
      <AnimatePresence>
        {memoizedDates.map(({ idx, date, jpDate }) => (
          <FadeListItem
            key={date + idx}
            style={{
              fontSize: "1rem",
              color: "#319795",
              padding: "8px 16px",
              borderBottom:
                idx !== dates.length - 1 ? "1px solid #e6fffa" : undefined,
              borderRadius: 8,
              marginBottom: 4,
              listStyleType: "none",
              background: idx % 2 === 1 ? "rgba(0, 128, 128, 0.06)" : "white",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text fontWeight="bold" minW="2em">
              {idx + 1}.
            </Text>
            <Text fontSize="sm" fontFamily="inherit" color="black">
              {jpDate}
            </Text>
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
          </FadeListItem>
        ))}
      </AnimatePresence>
    </Box>
  );
};

// LeaveDateListPropsのemployeeId等でemployeeIdをstring型で扱うように統一
// 既存のprops型定義・state・コールバック等でnumber型→string型に修正（types.tsに準拠）
