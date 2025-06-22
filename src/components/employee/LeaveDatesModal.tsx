// =============================
// LeaveDatesModal.tsx
// 有給取得日編集モーダルコンポーネント
// =============================
//
// このファイルは従業員ごとの有給取得日を編集・確認するモーダルUI部品です。
// - propsとしてモーダル開閉状態・従業員ID・従業員取得関数・日付編集用状態・ハンドラ等を受け取る
// - 日付編集の状態・バリデーションはカスタムフックで共通化
// - propsは「idのみ受け取り、データ参照はAppのstateから行う」形に統一
// - UI部品の小コンポーネント化・責務分離・型安全性を徹底
//
// 設計意図:
// - モーダルの責務は「日付リストUIと編集操作」のみに限定
// - 業務ロジックや状態管理は親(App)で一元化
// - 初学者でも理解しやすいように全体の流れ・propsの意味を日本語コメントで明記
//
// UI/UX:
// - ページネーション、残日数計算、エラー表示、リスト編集UI
//
// このファイルを通じて、従業員の有給取得日を簡単に確認・編集できるモーダルの実装方法を学べます。
// - 具体的には、Reactのfunctional component、propsの受け渡し、カスタムフックによる状態管理、
//   Chakra UIを用いたスタイリング、TypeScriptによる型安全なコーディング手法などが含まれます。
//
// 初学者の方は、まずはこのコンポーネントがどのように組み立てられているか、
// どのように親コンポーネントと連携しているかを中心に注目してみてください。
// その後、実際に手を動かして同様のコンポーネントを作成することで、
// ReactやTypeScript、Chakra UIの理解を深めることができるでしょう。

import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { X } from "lucide-react";
import React, { useRef, useEffect } from "react";
import { calcLeaveDays } from "./utils";
import type { Employee } from "./types";
import { ConfirmDeleteModal } from "../ui/ConfirmDeleteModal";
import { DateInputRow } from "./DateInputRow";
import { inputDateSmallStyle } from "./icons";
import { LeaveDateList } from "./LeaveDateList";

// propsの型定義。親(App)から必要な情報・関数を受け取る
interface LeaveDatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: number | null;
  getEmployee: (id: number) => Employee | undefined;
  editDateIdx: number | null;
  dateInput: string;
  onChangeDateInput: (v: string) => void;
  onAddDate: (date: string) => void;
  onEditDate: (idx: number) => void;
  onSaveDate: () => void;
  onDeleteDate: (idx: number) => void;
  currentPage: number; // 追加
  onPageChange: (page: number) => void; // 追加
}

// モーダル本体
export const LeaveDatesModal: React.FC<LeaveDatesModalProps> = ({
  isOpen,
  onClose,
  employeeId,
  getEmployee,
  editDateIdx,
  dateInput,
  onChangeDateInput,
  onAddDate,
  onEditDate,
  onSaveDate,
  onDeleteDate,
  currentPage,
  onPageChange,
}) => {
  const employee = employeeId ? getEmployee(employeeId) : undefined;
  if (!isOpen || !employee) return null;
  const dates = employee.leaveDates;
  // ページネーション用
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(dates.length / ITEMS_PER_PAGE));
  const pagedDates = dates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  // ページ切り替え時にリスト先頭へスクロール
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [currentPage]);
  // datesが減った場合にcurrentPageを自動調整
  useEffect(() => {
    if (currentPage > totalPages) onPageChange(totalPages);
  }, [dates.length, totalPages]);
  // 一覧と同じ「付与＋繰越－消化」単純計算
  const now = new Date();
  let grantThisYear = 0;
  let carryOver = 0;
  let foundGrant = false;
  if (employee.grants && employee.grants.length > 0) {
    employee.grants.forEach((g) => {
      const grantDate = new Date(g.grantDate);
      const grantYear = grantDate.getFullYear();
      const nowYear = now.getFullYear();
      const diffMonth =
        (now.getFullYear() - grantDate.getFullYear()) * 12 +
        (now.getMonth() - grantDate.getMonth());
      if (grantYear === nowYear && diffMonth < 24) {
        grantThisYear += g.days;
        foundGrant = true;
      } else if (grantYear === nowYear - 1 && diffMonth < 24) {
        carryOver += g.days;
      }
    });
  }
  if (!foundGrant) {
    grantThisYear = calcLeaveDays(employee.joinedAt, now);
  }
  const remainSimple = grantThisYear + carryOver - dates.length;
  // 削除確認モーダル用
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
          残日数：{remainSimple}日
        </Text>
        <DateInputRow
          dateInput={dateInput}
          onChangeDateInput={onChangeDateInput}
          onAddDate={onAddDate}
          onSaveDate={onSaveDate}
          editDateIdx={editDateIdx}
          remainSimple={remainSimple}
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
              onChangeDateInput={onChangeDateInput}
              onEditDate={onEditDate}
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
        {remainSimple <= 0 && (
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
