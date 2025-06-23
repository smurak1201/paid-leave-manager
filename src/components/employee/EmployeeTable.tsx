// =============================
// EmployeeTable.tsx
// 従業員一覧テーブルコンポーネント
// =============================
//
// 役割:
// ・従業員リストをテーブル表示
// ・編集/削除/確認ボタンのハンドラをpropsで受け取る
// ・UI部品の責務は「表示と操作ボタンの配置」のみに限定
// ・業務ロジックや状態管理は親(App)で一元化
//
// 設計意図:
// ・型安全・責務分離・UI/UX・可読性重視
// ・props/stateの流れ・UI部品の責務を日本語コメントで明記

// ===== import: 外部ライブラリ =====
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/table";
import { Box, Badge, IconButton, HStack, Icon } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";

// ===== import: 型定義 =====
import type { Employee, RowContentProps } from "./types";

// ===== import: アイコン・ユーティリティ =====
import { Icons, getServicePeriod } from "./icons";

// ===== import: UI部品 =====
import { Tooltip } from "../ui/tooltip";
import { ConfirmDeleteModal } from "../ui/ConfirmDeleteModal";
import { FadeTableRow } from "./FadeTableRow";

// propsの型定義。データと操作関数を親(App)から受け取る
interface EmployeeSummary {
  employeeId: string;
  grantThisYear: number;
  carryOver: number;
  used: number;
  remain: number;
}

interface EmployeeTableProps {
  employees: Employee[];
  summaries: EmployeeSummary[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  currentPage: number; // 現在のページ番号
  onPageChange: (page: number) => void; // ページ切替ハンドラ
}

// 従業員一覧テーブル本体
export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  summaries,
  onEdit,
  onDelete,
  onView,
  currentPage,
  onPageChange,
}) => {
  // ページネーション用
  const ITEMS_PER_PAGE = 15;
  const totalPages = Math.max(1, Math.ceil(employees.length / ITEMS_PER_PAGE));
  const pagedEmployees = useMemo(
    () =>
      employees.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [employees, currentPage]
  );
  const summaryMap = useMemo(() => {
    const map = new Map<string, EmployeeSummary>();
    summaries.forEach((s) => map.set(s.employeeId, s));
    return map;
  }, [summaries]);
  // ページ切替時にリスト先頭へスクロール
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [currentPage]);
  // 削除等でページ数が減った場合にcurrentPageを自動調整
  useEffect(() => {
    if (currentPage > totalPages) onPageChange(totalPages);
  }, [employees.length, totalPages]);

  // 削除対象の従業員ID（number型に修正）
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const prevEmployeesRef = useRef<Employee[]>(employees);

  // 追加時にrecentlyAddedIdをセットし、1秒後に解除
  useEffect(() => {
    // 新規追加された従業員を特定（アニメーションや色付け用途がなければ何もしない）
    prevEmployeesRef.current = employees;
  }, [employees]);

  // 削除ボタンクリック時のハンドラ（number型に修正）
  const handleDeleteClick = useCallback((id: string) => {
    setDeleteTarget(id);
    setDeleteOpen(true);
  }, []);
  // 削除確定時のハンドラ（number型に修正）
  const handleDeleteConfirm = () => {
    if (deleteTarget !== null) onDelete(deleteTarget);
    setDeleteOpen(false);
    setDeleteTarget(null);
  };
  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  // RowContentPropsの型定義はtypes.tsに移動済み
  const RowContent: React.FC<RowContentProps> = ({
    emp,
    grantThisYear,
    carryOver,
    used,
    remain,
    servicePeriod,
    onView,
    onEdit,
    handleDeleteClick,
  }) => {
    return (
      <>
        <Td>{emp.employeeId}</Td> {/* 従業員IDを表示 */}
        <Td>{emp.lastName}</Td>
        <Td>{emp.firstName}</Td>
        <Td>
          {(() => {
            const [y, m, d] = emp.joinedAt.split("-");
            return `${y}年${Number(m)}月${d ? Number(d) + "日" : ""}`;
          })()}
        </Td>
        <Td>{servicePeriod}</Td>
        <Td isNumeric>{grantThisYear}</Td>
        <Td isNumeric>{carryOver}</Td>
        <Td isNumeric>{used}</Td>
        <Td isNumeric>
          <Badge
            colorScheme={remain <= 3 ? "red" : remain <= 7 ? "yellow" : "teal"}
            fontSize="md"
            px={3}
            py={1}
            borderRadius="md"
            fontWeight="bold"
            minW="3em"
            textAlign="center"
          >
            {grantThisYear + carryOver - used}
          </Badge>
        </Td>
        <Td>
          <HStack justify="center" gap={1}>
            <Tooltip content="確認" showArrow>
              <IconButton
                aria-label="確認"
                size="sm"
                variant="ghost"
                colorScheme="blue"
                onClick={() => onView(String(emp.id))}
              >
                <Icon as={Icons.Eye} boxSize={5} />
              </IconButton>
            </Tooltip>
            <Tooltip content="編集" showArrow>
              <IconButton
                aria-label="編集"
                size="sm"
                variant="ghost"
                colorScheme="teal"
                onClick={() => onEdit(String(emp.id))}
              >
                <Icon as={Icons.Edit} boxSize={5} />
              </IconButton>
            </Tooltip>
            <Tooltip content="削除" showArrow>
              <IconButton
                aria-label="削除"
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={() => handleDeleteClick(String(emp.id))}
              >
                <Icon as={Icons.Trash2} boxSize={5} />
              </IconButton>
            </Tooltip>
          </HStack>
        </Td>
      </>
    );
  };

  return (
    <Box
      overflowX="auto"
      borderRadius="lg"
      boxShadow="lg"
      bg="white"
      p={2}
      maxW="100vw"
      mx="auto"
      mb={0}
      display="block"
      style={{ minWidth: 0 }}
      ref={listRef}
    >
      {/* ページネーション（テーブル上部） */}
      {employees.length > ITEMS_PER_PAGE && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={2}
          mb={2}
        >
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              padding: "4px 12px",
              borderRadius: 6,
              border: "1px solid #B2F5EA",
              background: currentPage === 1 ? "#eee" : "#fff",
              color: "black",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            前へ
          </button>
          <span style={{ fontSize: "0.95em", color: "black" }}>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: "4px 12px",
              borderRadius: 6,
              border: "1px solid #B2F5EA",
              background: currentPage === totalPages ? "#eee" : "#fff",
              color: "black",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            次へ
          </button>
        </Box>
      )}
      <Table
        variant="striped"
        colorScheme="teal"
        size="sm"
        sx={{
          minWidth: 650, // grantDays列追加で幅拡張
          width: "100%",
          "th, td": {
            fontSize: "sm",
            py: [1, 2],
            px: [1, 2],
            whiteSpace: "nowrap",
            textAlign: "center", // すべて中央揃え
          },
          th: {
            bg: "teal.50",
            color: "teal.700",
            fontWeight: "bold",
            letterSpacing: 1,
            textAlign: "center", // ヘッダーも中央揃え
          },
          td: {
            textAlign: "center", // データも中央揃え
          },
          tbody: {
            tr: {
              transition: "background 0.2s",
              _hover: { bg: "teal.100" },
            },
          },
        }}
      >
        <Thead position="sticky" top={0} zIndex={1}>
          <Tr>
            <Th>従業員コード</Th>
            <Th>姓</Th>
            <Th>名</Th>
            <Th>入社年月</Th>
            <Th>勤続年数</Th>
            <Th isNumeric>今年度付与</Th>
            <Th isNumeric>繰越</Th>
            <Th isNumeric>消化日数</Th>
            <Th isNumeric>残日数</Th>
            <Th minW="120px">操作</Th>
          </Tr>
        </Thead>
        <Tbody>
          <AnimatePresence>
            {pagedEmployees.map((emp, idx) => {
              const summary = summaryMap.get(emp.employeeId) ?? {
                grantThisYear: 0,
                carryOver: 0,
                used: 0,
                remain: 0,
              };
              const grantThisYear = summary.grantThisYear;
              const carryOver = summary.carryOver;
              const used = summary.used;
              const remain = summary.remain;
              const rowProps = {
                emp,
                grantThisYear,
                carryOver,
                used,
                remain,
                servicePeriod: getServicePeriod(emp.joinedAt),
                onView,
                onEdit,
                handleDeleteClick,
              };
              const style = {
                background:
                  remain === 0
                    ? "#FFF5F5"
                    : idx % 2 === 1
                    ? "rgba(0, 128, 128, 0.06)"
                    : undefined,
              };
              return (
                <FadeTableRow key={emp.id} style={style}>
                  <RowContent {...rowProps} />
                </FadeTableRow>
              );
            })}
          </AnimatePresence>
        </Tbody>
      </Table>
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        targetName={
          deleteTarget !== null
            ? (() => {
                const emp = employees.find((e) => e.id === deleteTarget);
                return emp ? `${emp.lastName} ${emp.firstName}` : undefined;
              })()
            : undefined
        }
        extraMessage={
          deleteTarget !== null
            ? "この従業員の有給取得日も全て削除されます。"
            : undefined
        }
      />
    </Box>
  );
};
