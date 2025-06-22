// =============================
// LeaveDateList.tsx
// 有給取得日リスト表示用小コンポーネント
// =============================
//
// このファイルは有給取得日をリスト表示する小UI部品です。
// - propsとして日付リスト・編集/削除ハンドラ等を受け取る
// - UI部品の小コンポーネント化・責務分離
//
// 設計意図:
// - 日付リストの責務を分離し、モーダル本体の可読性・保守性を向上
// - 初学者でも理解しやすいように全体の流れ・propsの意味を日本語コメントで明記
//
// UI/UX:
// - 奇数行背景色、フォント・色統一、インライン編集
//
// Props:
// - dates: 日付のリスト
// - editDateIdx: 編集中の日付のインデックス
// - dateInput: 入力中の日付
// - onChangeDateInput: 日付入力変更時のハンドラ
// - onEditDate: 編集ボタン押下時のハンドラ
// - onDeleteDate: 削除ボタン押下時のハンドラ
// - inputDateSmallStyle: 日付入力欄のスタイル
// - pagedDates: ページネーションされた日付のリスト
// - currentPage: 現在のページ番号
// - ITEMS_PER_PAGE: 1ページあたりのアイテム数
//
// State:
// - なし（親コンポーネントから全てのデータをpropsで受け取るため）
//
// UI部品の役割:
// - 日付リストの表示
// - 編集・削除ボタンの表示
// - ページネーション対応
// - 編集中の日付のインライン編集対応

// 有給取得日リストのUI部品。リスト表示・編集・削除ボタンなどをまとめて管理します。
// ページネーションや編集インデックスもpropsで制御し、再利用性を高めています。
import { Box, Button, Text } from "@chakra-ui/react";
import { Icons } from "./icons";
import React from "react";

interface LeaveDateListProps {
  dates: string[];
  editDateIdx: number | null;
  dateInput: string;
  onChangeDateInput: (v: string) => void;
  onEditDate: (idx: number) => void;
  onDeleteDate: (idx: number) => void;
  inputDateSmallStyle: React.CSSProperties;
  pagedDates: string[];
  currentPage: number;
  ITEMS_PER_PAGE: number;
}

/**
 * 有給取得日リスト部分（LeaveDatesModalから分離）
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
