// =============================
// App.tsx
// 有給休暇管理アプリのメインコンポーネント
// =============================
//
// 役割:
// ・全体の状態管理（従業員リスト、モーダルの開閉、選択中の従業員IDなど）
// ・主要なUI部品（テーブル・モーダル等）の呼び出しとprops受け渡し
// ・カスタムフックによるフォーム・日付編集・バリデーションの共通化
// ・props/stateの流れは「idのみ渡し、データ参照はAppのstateから行う」
// ・日本法令に即した有給付与・消化・繰越・時効消滅ロジックをUI/UX重視で実装
//
// 設計意図:
// ・単方向データフロー、props/stateの最小化、カスタムフック活用、責務分離、型・バリデーション共通化、小コンポーネント化
// ・全てのprops/stateの流れ・UI部品の責務・業務ロジック・型定義・バリデーション・設計意図を日本語コメントで明記

import { useState } from "react";
import { Box, Heading, Button, Flex, useDisclosure } from "@chakra-ui/react";
import type { Employee } from "./components/employee/types";
import { EmployeeTable } from "./components/employee/EmployeeTable";
import { EmployeeModal } from "./components/employee/EmployeeModal";
import { Icons } from "./components/employee/icons";
import { GuideModal } from "./components/ui/GuideModal";
import { LeaveDatesModal } from "./components/employee/LeaveDatesModal";
import { calcLeaveDays } from "./components/employee/utils";
import { useEmployeeForm } from "./hooks/useEmployeeForm";
import { useLeaveDates } from "./hooks/useLeaveDates";
import { initialEmployees } from "./sampleData/employees";

function App() {
  // --- グローバル状態管理 ---
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [currentPage, setCurrentPage] = useState(1); // 従業員一覧テーブルのページ番号
  const [leaveDatesPage, setLeaveDatesPage] = useState(1); // 有給取得日モーダルのページ番号
  const [activeModal, setActiveModal] = useState<
    null | "add" | "edit" | "leaveDates"
  >(null); // 開いているモーダル種別
  const [activeEmployeeId, setActiveEmployeeId] = useState<number | null>(null); // 操作対象従業員ID
  const guideDisclosure = useDisclosure(); // ガイドモーダル開閉

  // --- 選択中従業員データ取得 ---
  const currentEmployee =
    activeEmployeeId !== null
      ? employees.find((e) => e.id === activeEmployeeId) || null
      : null;

  // --- 従業員フォームの状態・バリデーション管理（カスタムフック） ---
  // form, handleChangeはこのファイル内では直接使わないため分割代入から除外
  const { setForm, idError, setIdError } = useEmployeeForm(
    activeModal === "edit" && currentEmployee
      ? currentEmployee
      : {
          id: NaN,
          lastName: "",
          firstName: "",
          joinedAt: "",
          total: 20,
          used: 0,
          leaveDates: [],
        },
    employees,
    activeEmployeeId
  );

  // --- 有給取得日編集用の状態・ロジック（カスタムフック） ---
  const {
    editDateIdx,
    setEditDateIdx,
    dateInput,
    setDateInput,
    handleAddDate,
    handleEditDate,
    handleSaveDate,
    handleDeleteDate,
  } = useLeaveDates(currentEmployee);

  // --- UIイベントハンドラ ---
  // テーブル「確認」ボタン
  const handleView = (id: number) => {
    setActiveEmployeeId(id);
    setActiveModal("leaveDates");
    setEditDateIdx(null);
    setDateInput("");
  };
  // テーブル「編集」ボタン
  const handleEdit = (id: number) => {
    const emp = employees.find((e) => e.id === id);
    if (emp) setForm(emp);
    setActiveEmployeeId(id);
    setActiveModal("edit");
    setIdError("");
  };
  // 「従業員追加」ボタン
  const handleAdd = () => {
    setForm({
      id: NaN,
      lastName: "",
      firstName: "",
      joinedAt: "",
      total: 20,
      used: 0,
      leaveDates: [],
    });
    setActiveEmployeeId(null);
    setActiveModal("add");
    setIdError("");
  };
  // モーダルを閉じる
  const handleCloseModal = () => {
    setActiveModal(null);
    setActiveEmployeeId(null);
    setEditDateIdx(null);
    setDateInput("");
    setIdError("");
    setForm({
      id: NaN,
      lastName: "",
      firstName: "",
      joinedAt: "",
      total: 20,
      used: 0,
      leaveDates: [],
    });
  };

  // --- 画面描画 ---
  return (
    <Box minH="100vh" bgGradient="linear(to-br, teal.50, white)" py={10}>
      <Box
        maxW="900px"
        mx="auto"
        p={6}
        borderRadius="lg"
        boxShadow="lg"
        bg="whiteAlpha.900"
      >
        {/* タイトル */}
        <Heading
          mb={8}
          color="teal.700"
          textAlign="center"
          fontWeight="bold"
          letterSpacing={2}
        >
          有給休暇管理
        </Heading>
        {/* ガイド・従業員追加ボタン */}
        <Flex mb={6} justify="flex-end" gap={4}>
          <Button
            colorScheme="teal"
            variant="outline"
            onClick={guideDisclosure.onOpen}
            size="md"
            px={6}
            boxShadow="md"
          >
            <Icons.Info size={18} style={{ marginRight: 6 }} />
            ガイド
          </Button>
          <Button
            colorScheme="teal"
            variant="outline"
            onClick={handleAdd}
            size="md"
            px={6}
            boxShadow="md"
          >
            <Icons.Plus size={18} style={{ marginRight: 6 }} />
            従業員追加
          </Button>
        </Flex>
        {/* ガイドモーダル */}
        <GuideModal
          open={guideDisclosure.open}
          onClose={guideDisclosure.onClose}
        />
        {/* 従業員一覧テーブル */}
        <EmployeeTable
          employees={employees}
          onEdit={handleEdit}
          onDelete={(id) =>
            setEmployees((prev) => prev.filter((e) => e.id !== id))
          }
          onView={handleView}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        {/* 従業員追加・編集モーダル */}
        <EmployeeModal
          isOpen={activeModal === "add" || activeModal === "edit"}
          onClose={handleCloseModal}
          employeeId={activeModal === "add" ? null : activeEmployeeId}
          getEmployee={(id) => employees.find((e) => e.id === id)}
          onAdd={(form) => {
            // 入力バリデーション
            if (
              !form.id ||
              !form.lastName ||
              !form.firstName ||
              !form.joinedAt ||
              idError ||
              employees.some((emp) => emp.id === form.id)
            ) {
              setIdError(
                "従業員コードが重複しています、または全ての項目を正しく入力してください"
              );
              return;
            }
            // 勤続年数から付与日数を自動計算
            const autoTotal = calcLeaveDays(form.joinedAt);
            const newEmp = { ...form, total: autoTotal };
            setEmployees([...employees, { ...newEmp }]);
            // 追加後に最終ページへ移動
            const ITEMS_PER_PAGE = 15;
            const newTotal = employees.length + 1;
            setCurrentPage(Math.ceil(newTotal / ITEMS_PER_PAGE));
            setForm({
              id: NaN,
              lastName: "",
              firstName: "",
              joinedAt: "",
              total: 20,
              used: 0,
              leaveDates: [],
            });
            setActiveEmployeeId(null);
            setActiveModal(null);
          }}
          onSave={(form) => {
            // 入力バリデーション
            if (
              !form.id ||
              !form.lastName ||
              !form.firstName ||
              !form.joinedAt ||
              idError
            ) {
              setIdError("全ての項目を正しく入力してください");
              return;
            }
            // 勤続年数から付与日数を自動計算
            const autoTotal = calcLeaveDays(form.joinedAt);
            const newEmp = { ...form, total: autoTotal };
            setEmployees((prev) =>
              prev.map((emp) =>
                emp.id === activeEmployeeId ? { ...newEmp } : emp
              )
            );
            setForm({
              id: NaN,
              lastName: "",
              firstName: "",
              joinedAt: "",
              total: 20,
              used: 0,
              leaveDates: [],
            });
            setActiveEmployeeId(null);
            setActiveModal(null);
          }}
          idError={idError}
          editId={activeModal === "edit" ? activeEmployeeId : null}
          employees={employees}
          setIdError={setIdError}
        />
        {/* 有給取得日モーダル */}
        <LeaveDatesModal
          isOpen={activeModal === "leaveDates"}
          onClose={handleCloseModal}
          employeeId={activeEmployeeId}
          getEmployee={(id) => employees.find((e) => e.id === id)}
          editDateIdx={editDateIdx}
          dateInput={dateInput}
          onChangeDateInput={setDateInput}
          onAddDate={(date) => {
            // 日付追加時のロジック
            const emp = employees.find((e) => e.id === activeEmployeeId);
            if (!emp) return;
            handleAddDate(date, (dates) => {
              setEmployees((prev) =>
                prev.map((e) =>
                  e.id === emp.id ? { ...e, leaveDates: dates } : e
                )
              );
              // 追加後に最終ページへ移動
              const ITEMS_PER_PAGE = 10;
              const newTotal = dates.length;
              setLeaveDatesPage(Math.ceil(newTotal / ITEMS_PER_PAGE));
            });
          }}
          onEditDate={handleEditDate}
          onSaveDate={() => {
            // 日付編集保存時のロジック
            const emp = employees.find((e) => e.id === activeEmployeeId);
            if (!emp) return;
            handleSaveDate((dates) =>
              setEmployees((prev) =>
                prev.map((e) =>
                  e.id === emp.id ? { ...e, leaveDates: dates } : e
                )
              )
            );
          }}
          onDeleteDate={(idx) => {
            // 日付削除時のロジック
            const emp = employees.find((e) => e.id === activeEmployeeId);
            if (!emp) return;
            handleDeleteDate(idx, (dates) =>
              setEmployees((prev) =>
                prev.map((e) =>
                  e.id === emp.id ? { ...e, leaveDates: dates } : e
                )
              )
            );
          }}
          currentPage={leaveDatesPage}
          onPageChange={setLeaveDatesPage}
        />
      </Box>
    </Box>
  );
}

export default App;
