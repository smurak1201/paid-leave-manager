// =====================================================
// LeaveDateList.tsx
// -----------------------------------------------------
// 【有給休暇管理アプリ】有給取得日リスト表示コンポーネント
// -----------------------------------------------------
// ▼主な役割
//   - 有給取得日一覧の表示
//   - 削除ボタン等の操作UI
// ▼設計意図
//   - 表示UIの責務分離・型安全・再利用性重視
//   - propsで必要なデータ・関数のみ受け取り、状態は持たない
// ▼使い方
//   - LeaveDatesModal等からpropsでデータ・操作関数を受け取る
// =====================================================

// ===== import: 外部ライブラリ =====
import { Box, Button, Text } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { AnimatePresence } from "framer-motion";

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
  isReadOnly,
}) => {
  // 日付リストを日本語表記に変換し、インデックス付きでメモ化
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
      {/* 各日付をリスト表示。削除ボタン付き */}
      <AnimatePresence>
        {memoizedDates.map(({ idx, date, jpDate }) => (
          <li
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
              justifyContent: "space-between",
            }}
          >
            <Text as="span">{jpDate}</Text>
            <Button
              size="xs"
              colorScheme="red"
              variant="ghost"
              onClick={() => onDeleteDate(idx)}
              disabled={isReadOnly}
              cursor={isReadOnly ? "not-allowed" : undefined}
              opacity={isReadOnly ? 0.5 : 1}
            >
              <Icons.Trash2 size={16} /> 削除
            </Button>
          </li>
        ))}
      </AnimatePresence>
    </Box>
  );
};

// LeaveDateListPropsのemployeeId等でemployeeIdをstring型で扱うように統一
// 既存のprops型定義・state・コールバック等でnumber型→string型に修正（types.tsに準拠）
