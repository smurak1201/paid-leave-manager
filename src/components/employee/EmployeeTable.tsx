// =====================================================
// EmployeeTable.tsx
// -----------------------------------------------------
// 【有給休暇管理アプリ】従業員一覧テーブルコンポーネント
// -----------------------------------------------------
// ▼主な役割
//   - 従業員リストをテーブル形式で表示
//   - 編集/削除/確認などの操作ボタンを各行に配置
//   - ページネーションや削除モーダルなど一覧画面のUI管理
// ▼設計意図
//   - 表示と操作UIの責務分離・型安全・再利用性重視
//   - propsで必要なデータ・関数のみ受け取り、状態は最小限
// ▼使い方
//   - App.tsxからpropsでデータ・操作関数を受け取る
// =====================================================

// ===== import: 外部ライブラリ =====
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Table, Thead, Tbody, Tr, Th } from "@chakra-ui/table";
import { Box } from "@chakra-ui/react";

// ===== import: 型定義 =====
import type { Employee, EmployeeSummary, EmployeeTableProps } from "./types";

// ===== import: ユーティリティ・アイコン =====
import { getServicePeriod } from "./icons";

// ===== import: UI部品 =====
import { ConfirmDeleteModal } from "../ui/ConfirmDeleteModal";
import { EmployeeTableRow } from "./EmployeeTableRow";

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  summaries,
  onEdit,
  onDelete,
  onView,
  currentPage,
  onPageChange,
}) => {
  // ===============================
  // ▼状態管理・ページネーション
  // ===============================
  // 1ページあたりの表示件数
  const ITEMS_PER_PAGE = 15;
  // 総ページ数を計算
  const totalPages = Math.max(1, Math.ceil(employees.length / ITEMS_PER_PAGE));
  // 現在ページに表示する従業員リストを抽出
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
  // ページ切替時にリスト先頭へスクロール（UX向上のため）
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [currentPage]);
  // 削除等でページ数が減った場合にcurrentPageを自動調整（例：最終ページで削除したとき）
  useEffect(() => {
    if (currentPage > totalPages) onPageChange(totalPages);
  }, [employees.length, totalPages]);

  // ===============================
  // ▼削除モーダル・削除処理
  // ===============================
  // 削除対象の従業員ID（string型に修正）
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const prevEmployeesRef = useRef<Employee[]>(employees);

  // 追加時にrecentlyAddedIdをセットし、1秒後に解除
  useEffect(() => {
    // 新規追加された従業員を特定（アニメーションや色付け用途がなければ何もしない）
    prevEmployeesRef.current = employees;
  }, [employees]);

  // 削除ボタンクリック時のハンドラ（string型に修正）
  const handleDeleteClick = useCallback((id: string) => {
    setDeleteTarget(id);
    setDeleteOpen(true);
  }, []);
  // 削除確定時のハンドラ（string型に修正）
  const handleDeleteConfirm = () => {
    if (deleteTarget !== null) onDelete(deleteTarget);
    setDeleteOpen(false);
    setDeleteTarget(null);
  };
  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  // ===============================
  // ▼ページネーションUI部品（ローカル定義）
  // ===============================
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
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        style={{
          padding: "4px 12px",
          borderRadius: 6,
          border: "1px solid #B2F5EA",
          background: current === 1 ? "#eee" : "#fff",
          color: "black",
          cursor: current === 1 ? "not-allowed" : "pointer",
        }}
      >
        前へ
      </button>
      <span style={{ fontSize: "0.95em", color: "black" }}>
        {current} / {total}
      </span>
      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        style={{
          padding: "4px 12px",
          borderRadius: 6,
          border: "1px solid #B2F5EA",
          background: current === total ? "#eee" : "#fff",
          color: "black",
          cursor: current === total ? "not-allowed" : "pointer",
        }}
      >
        次へ
      </button>
    </Box>
  );

  // ===============================
  // ▼サマリー取得関数
  // ===============================
  const getSummary = (id: string) =>
    summaryMap.get(id) ?? {
      grantThisYear: 0,
      carryOver: 0,
      used: 0,
      remain: 0,
    };

  // ===============================
  // ▼UI描画
  // ===============================
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
        <PageNav
          current={currentPage}
          total={totalPages}
          onChange={onPageChange}
        />
      )}
      <Table
        variant="striped"
        colorScheme="teal"
        size="sm"
        sx={{
          minWidth: 650,
          width: "100%",
          "th, td": {
            fontSize: "sm",
            py: [1, 2],
            px: [1, 2],
            whiteSpace: "nowrap",
            textAlign: "center",
          },
          th: {
            bg: "teal.50",
            color: "teal.700",
            fontWeight: "bold",
            letterSpacing: 1,
            textAlign: "center",
          },
          td: {
            textAlign: "center",
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
          {pagedEmployees.map((emp, i) => {
            const summary = getSummary(emp.employeeId);
            const rowProps = {
              emp,
              grantThisYear: summary.grantThisYear,
              carryOver: summary.carryOver,
              used: summary.used,
              remain: summary.remain,
              servicePeriod: getServicePeriod(emp.joinedAt),
              onView,
              onEdit,
              onDelete, // 追加
              handleDeleteClick,
              rowIndex: i, // 行インデックスを明示的に渡す
              isReadOnly:
                typeof window !== "undefined" &&
                window.sessionStorage.getItem("auth")
                  ? JSON.parse(window.sessionStorage.getItem("auth") || "{}")
                      .role === "viewer"
                  : false,
            };
            return <EmployeeTableRow key={emp.employeeId} {...rowProps} />;
          })}
        </Tbody>
      </Table>
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        targetName={
          deleteTarget !== null
            ? (() => {
                const emp = employees.find(
                  (e) => e.employeeId === deleteTarget
                );
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
