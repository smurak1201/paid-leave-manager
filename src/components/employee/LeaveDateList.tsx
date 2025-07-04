// =====================================================
// LeaveDateList.tsx
// -----------------------------------------------------
// このファイルは従業員の有給取得日リスト表示コンポーネントです。
// 主な役割:
//   - 有給取得日一覧の表示
//   - 削除ボタン等の操作UI
// 設計意図:
//   - 表示UIの責務分離・型安全・再利用性重視
//   - propsで必要なデータ・関数のみ受け取り、状態は持たない
// 使い方:
//   - LeaveDatesModal等からpropsでデータ・操作関数を受け取る
// =====================================================
//
// 役割:
// ・有給取得日リストを一覧表示し、各日付ごとに削除ボタンを表示
//
// 設計意図:
// ・型安全・責務分離・UI/UX・可読性重視
// ・リスト表示のみに責務を限定し、ロジックや状態管理は親に委譲

// ===== import: Chakra UI部品 =====
import { Box, Button, Text } from "@chakra-ui/react";
// ===== import: React本体・フック =====
import React, { useMemo } from "react";
// ===== import: アニメーション（未使用なら削除可） =====
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
