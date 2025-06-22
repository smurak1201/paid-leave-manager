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
import React, { useRef, useEffect } from "react";
import { X } from "lucide-react";

// ===== import: 型定義 =====
import type { LeaveDatesModalProps } from "./types";

// ===== import: ユーティリティ・UI部品 =====
import { ConfirmDeleteModal } from "../ui/ConfirmDeleteModal";
import { DateInputRow } from "./DateInputRow";
import { inputDateSmallStyle } from "./icons";
import { LeaveDateList } from "./LeaveDateList";

// ===== import: サンプルデータ・集計ロジック =====
import { employees, calcLeaveSummary } from "../../sampleData/dbSampleTables";

// propsの型定義はtypes.tsに集約
export const LeaveDatesModal: React.FC<LeaveDatesModalProps> = ({
  isOpen,
  onClose,
  employeeId,
  leaveUsages,
  onAddDate,
  onDeleteDate,
  editDateIdx,
  setEditDateIdx,
  dateInput,
  setDateInput,
  currentPage,
  onPageChange,
}) => {
  // 対象従業員データ取得
  const employee = employeeId
    ? employees.find((e) => e.id === employeeId)
    : undefined;
  if (!isOpen || !employee) return null;
  // --- leaveUsagesからこの従業員の消化履歴を抽出 ---
  const usages = leaveUsages.filter((u) => u.employeeId === employee.id);
  const dates = usages.map((u) => u.usedDate).sort();
  // --- 残日数等の集計 ---
  const now = new Date();
  const summary = calcLeaveSummary(employee.id, now.toISOString().slice(0, 10));
  const remain = summary ? summary.remain : 0;

  // ページネーション用
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(dates.length / ITEMS_PER_PAGE));
  const pagedDates = dates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
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
  const [deleteIdx, setDeleteIdx] = React.useState<number | null>(null);
  const [isDeleteOpen, setDeleteOpen] = React.useState(false);
  const handleDeleteClick = (idx: number) => {
    setDeleteIdx(idx);
    setDeleteOpen(true);
  };
  const handleDeleteConfirm = () => {
    if (deleteIdx !== null) onDeleteDate(deleteIdx);
    setDeleteOpen(false);
    setDeleteIdx(null);
  };
  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setDeleteIdx(null);
  };

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
      onClick={onClose}
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
          {employee.lastName} {employee.firstName} さんの有給取得日
        </Heading>
        <Text color="teal.700" fontWeight="bold" mb={1} textAlign="center">
          消化日数：{dates.length}日
        </Text>
        <Text color="teal.700" fontWeight="bold" mb={2} textAlign="center">
          残日数：{remain}日
        </Text>
        <DateInputRow
          dateInput={dateInput}
          onChangeDateInput={setDateInput}
          onAddDate={onAddDate}
          onSaveDate={() => onAddDate(dateInput)}
          editDateIdx={editDateIdx}
          remainSimple={remain}
        />
        {dates.length === 0 ? (
          <Text color="gray.500" textAlign="center">
            取得履歴なし
          </Text>
        ) : (
          <>
            {/* ページネーション（リストの上） */}
            {dates.length > ITEMS_PER_PAGE && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={2}
                mb={2}
              >
                <Button
                  size="sm"
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                >
                  前へ
                </Button>
                <Text fontSize="sm" mx={2}>
                  {currentPage} / {totalPages}
                </Text>
                <Button
                  size="sm"
                  onClick={() =>
                    onPageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  variant="outline"
                >
                  次へ
                </Button>
              </Box>
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
              onDeleteDate={handleDeleteClick}
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
