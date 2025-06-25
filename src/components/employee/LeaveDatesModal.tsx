// =============================
// LeaveDatesModal.tsx
// 有給取得日編集モーダル
// =============================
//
// 役割:
// ・従業員ごとの有給取得日を編集・確認するモーダルUI
// ・propsで必要な情報・関数を受け取る
//
// 設計意図:
// ・型安全・責務分離・UI/UX・可読性重視
// ・props/stateの流れ・UI部品の責務を日本語コメントで明記

// ===== import: 外部ライブラリ =====
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import React, {
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from "react";
import { X } from "lucide-react";

// ===== import: 型定義 =====
import type { LeaveDatesModalProps } from "./types";

// ===== import: ユーティリティ・UI部品 =====
import { ConfirmDeleteModal } from "../ui/ConfirmDeleteModal";
import { DateInputRow } from "./DateInputRow";
import { inputDateSmallStyle } from "./icons";
import { LeaveDateList } from "./LeaveDateList";

// propsの型定義はtypes.tsに集約
export const LeaveDatesModal: React.FC<LeaveDatesModalProps> = ({
  isOpen,
  onClose,
  onAddDate,
  onDeleteDate,
  editDateIdx,
  setEditDateIdx,
  dateInput,
  setDateInput,
  currentPage,
  onPageChange,
  summary,
  usedDates,
  grantDetails,
  addDateError,
}) => {
  if (!isOpen) return null;
  // usedDatesがあればそれを使う。なければgrantDetailsから生成
  const getDates = () =>
    usedDates && usedDates.length > 0
      ? [...usedDates].sort()
      : grantDetails
      ? grantDetails.flatMap((g) => g.usedDates).sort()
      : [];
  const dates = useMemo(getDates, [usedDates, grantDetails]);
  const remain = summary.remain;

  // ページネーション用
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(dates.length / ITEMS_PER_PAGE));
  const pagedDates = useMemo(
    () =>
      dates.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [dates, currentPage]
  );
  // ページ切替時にリスト先頭へスクロール
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [currentPage]);
  // datesが減った場合にcurrentPageを自動調整
  useEffect(() => {
    if (currentPage > totalPages) onPageChange(totalPages);
  }, [dates.length, totalPages]);

  // 削除モーダル用状態
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const handleDelete = useCallback((idx: number) => {
    setDeleteIdx(idx);
    setDeleteOpen(true);
  }, []);
  const handleDeleteConfirm = useCallback(async () => {
    if (deleteIdx !== null) {
      const result = await onDeleteDate(deleteIdx);
      if (result) {
        setDeleteOpen(false);
        setDeleteIdx(null);
      }
    }
  }, [deleteIdx, onDeleteDate]);
  const handleDeleteClose = useCallback(() => {
    setDeleteOpen(false);
    setDeleteIdx(null);
  }, []);

  // 日付追加時の重複チェック付きラッパー
  // handleAddDateの重複チェック・エラー表示はApp.tsxで行うため、ここではalertやaddDateError呼び出しは不要。
  const handleAddDate = useCallback(
    async (date: string) => {
      if (!date) return;
      await onAddDate(date);
    },
    [onAddDate]
  );

  // ページネーション共通部品
  const PageNav: React.FC<{
    current: number;
    total: number;
    onChange: (n: number) => void;
  }> = ({ current, total, onChange }) => (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={2}
      mb={2}
    >
      <Button
        size="sm"
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        variant="outline"
      >
        前へ
      </Button>
      <Text fontSize="sm" mx={2}>
        {current} / {total}
      </Text>
      <Button
        size="sm"
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        variant="outline"
      >
        次へ
      </Button>
    </Box>
  );

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      zIndex={2000}
      bg="blackAlpha.400"
      display="flex"
      alignItems="center"
      justifyContent="center"
      onClick={isDeleteOpen ? undefined : onClose}
    >
      <Box
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        p={6}
        minW="340px"
        maxW="90vw"
        position="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          position="absolute"
          top={2}
          right={2}
          size="sm"
          variant="ghost"
          colorScheme="teal"
          onClick={onClose}
          p={2}
          minW={"auto"}
        >
          <X size={18} />
        </Button>
        <Heading as="h3" size="md" mb={4} color="teal.700" textAlign="center">
          有給取得日
        </Heading>
        <Text color="teal.700" fontWeight="bold" mb={1} textAlign="center">
          消化日数：{dates.length}日
        </Text>
        <Text color="teal.700" fontWeight="bold" mb={2} textAlign="center">
          残日数：{remain}日
        </Text>
        {/* 付与ごとの詳細を表示したい場合はgrantDetailsを利用してテーブル等で表示可能 */}
        <DateInputRow
          dateInput={dateInput}
          onChangeDateInput={setDateInput}
          onAddDate={handleAddDate}
          onSaveDate={() => handleAddDate(dateInput)}
          editDateIdx={editDateIdx}
          remainSimple={remain}
        />
        {addDateError && (
          <Text color="red.500" fontSize="sm" mt={-2} mb={2} textAlign="center">
            {addDateError}
          </Text>
        )}
        {dates.length === 0 ? (
          <Text color="gray.500" textAlign="center">
            取得履歴なし
          </Text>
        ) : (
          <>
            {/* ページネーション（リストの上） */}
            {dates.length > ITEMS_PER_PAGE && (
              <PageNav
                current={currentPage}
                total={totalPages}
                onChange={onPageChange}
              />
            )}
            <LeaveDateList
              dates={dates}
              editDateIdx={editDateIdx}
              dateInput={dateInput}
              onChangeDateInput={setDateInput}
              onEditDate={(idx) => {
                setEditDateIdx(idx);
                setDateInput(pagedDates[idx] ?? "");
              }}
              onDeleteDate={handleDelete}
              inputDateSmallStyle={inputDateSmallStyle}
              pagedDates={pagedDates}
              currentPage={currentPage}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
            />
          </>
        )}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
          <Button onClick={onClose} variant="ghost" colorScheme="teal">
            キャンセル
          </Button>
        </Box>
        {remain <= 0 && (
          <Text color="red.500" fontSize="sm" mt={2} textAlign="right">
            残日数が0の場合、有給取得日は登録できません。
          </Text>
        )}
      </Box>
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        targetName={
          deleteIdx !== null && dates[deleteIdx]
            ? `${dates[deleteIdx]
                .replace(/-/g, "年")
                .replace(/年(\d{2})$/, "月$1日")}`
            : undefined
        }
      />
    </Box>
  );
};
// 不要なローカルロジックや未使用変数はなし。props/stateの流れ・責務分離は現状で最適化済み。
// UI部品・デザイン・ガイドモーダルは現状維持
// main.tsxは変更せず、App.tsxがメインエントリ
