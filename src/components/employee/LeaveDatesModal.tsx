// =====================================================
// LeaveDatesModal.tsx
// -----------------------------------------------------
// このファイルは従業員の有給取得日一覧・追加・削除モーダルです。
// 主な役割:
//   - 有給取得日リストの表示・追加・削除UI
//   - 入力バリデーション・エラーメッセージ表示
// 設計意図:
//   - モーダルUIの責務分離・型安全・再利用性重視
//   - propsで必要なデータ・関数のみ受け取り、状態は最小限
// 使い方:
//   - App.tsxからpropsでデータ・操作関数を受け取る
// =====================================================

// =============================
// LeaveDatesModal.tsx
// 有給取得日編集モーダル
// =============================
//
// 役割:
// ・従業員ごとの有給取得日を編集・確認するためのモーダルUI
// ・propsで必要な情報・関数（追加・削除・ページ切替など）を受け取る
//
// 設計意図:
// ・型安全・責務分離・UI/UX・可読性重視
// ・モーダルの状態管理やロジックはこのコンポーネントで完結
// ・UI部品の責務を明確にし、親コンポーネントはデータ管理に専念できるようにする

// ===== import: Chakra UI部品 =====
import { Box, Button, Heading, Text } from "@chakra-ui/react";
// ===== import: React本体・フック =====
import React, {
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from "react";
// ===== import: アイコン =====
import { X } from "lucide-react";
// ===== import: 型定義 =====
import type { LeaveDatesModalProps } from "./types";
// ===== import: ユーティリティ・UI部品 =====
import { ConfirmDeleteModal } from "../ui/ConfirmDeleteModal";
import { DateInputRow } from "./DateInputRow";
import { LeaveDateList } from "./LeaveDateList";
import { PageNav } from "./PageNav";

// propsの型定義はtypes.tsに集約
export const LeaveDatesModal: React.FC<LeaveDatesModalProps> = ({
  isOpen,
  onClose,
  onAddDate,
  onDeleteDate,
  editDateIdx,
  dateInput,
  setDateInput,
  currentPage,
  onPageChange,
  summary,
  usedDates,
  grantDetails,
  addDateError,
}) => {
  // モーダルが開いていない場合は何も表示しない
  if (!isOpen) return null;

  // usedDatesがあればそれを使い、なければgrantDetailsから生成
  const getDates = () =>
    usedDates && usedDates.length > 0
      ? [...usedDates].sort()
      : grantDetails
      ? grantDetails.flatMap((g) => g.usedDates).sort()
      : [];
  // 表示する日付リスト（ページネーション対応）
  const dates = useMemo(getDates, [usedDates, grantDetails]);
  // 残日数（0なら追加不可）
  const remain = summary.remain;

  // ページネーション用
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(dates.length / ITEMS_PER_PAGE));

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
            {/* ページごとに分割して渡す */}
            <LeaveDateList
              dates={dates.slice(
                (currentPage - 1) * ITEMS_PER_PAGE,
                (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
              )}
              onDeleteDate={(idx) =>
                handleDelete((currentPage - 1) * ITEMS_PER_PAGE + idx)
              }
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
// usedDates, grantDetails, summary, addDateError などpropsの重複・未使用を整理
// getDates, dates, remain, ページネーションロジックの重複を整理
// handleAddDate, handleDelete, handleDeleteConfirm, handleDeleteCloseの責務を明確化
// 不要なコメントや未使用変数を削除
