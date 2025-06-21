// =============================
// App.tsx
// アプリのメインエントリポイント
// =============================
//
// このファイルは有給休暇管理アプリの最上位コンポーネントです。
// - 全体の状態管理（従業員リスト、モーダルの開閉、選択中の従業員IDなど）
// - 主要なUI部品（テーブル・モーダル等）の呼び出しとpropsの受け渡し
// - カスタムフックによるフォーム・日付編集の状態・バリデーション共通化
// - props/stateの流れを「idのみ受け取り、データ参照はAppのstateから行う」形に統一
// - 日本法令に即した有給付与・消化・繰越・時効消滅のロジックをUI/UX重視で実装
//
// 設計意図:
// - React公式推奨の「単方向データフロー」「props/stateの最小化」「カスタムフックの活用」「責務分離」「型・バリデーションの共通化」「UI部品の小コンポーネント化」など、可読性・保守性を最大限高める構成
// - 全てのprops/stateの流れ・UI部品の責務・業務ロジック・型定義・バリデーション・設計意図を日本語コメントで明記
//
// 主要なUI部品・カスタムフック・型定義・業務ロジック・propsの流れ・設計意図をすべてコメントで明記しています。

// アプリのメインエントリポイント
// ReactのuseStateなどのフックをインポート
import { useState } from "react";
// Chakra UIのUI部品をインポート
import { Box, Heading, Button, Flex, useDisclosure } from "@chakra-ui/react";
// 型定義のインポート
import type { Employee } from "./components/employee/types";
// 各種コンポーネントのインポート
import { EmployeeTable } from "./components/employee/EmployeeTable";
import { EmployeeModal } from "./components/employee/EmployeeModal";
import { Icons } from "./components/employee/icons";
import { GuideModal } from "./components/ui/GuideModal";
import { LeaveDatesModal } from "./components/employee/LeaveDatesModal";
import { calcLeaveDays } from "./components/employee/utils";
import { useEmployeeForm } from "./hooks/useEmployeeForm";
import { useLeaveDates } from "./hooks/useLeaveDates";

// 初期従業員データ（サンプル）
const initialEmployees: Employee[] = [
  {
    id: "001",
    lastName: "山田",
    firstName: "太郎",
    joinedAt: "2021-02-15",
    grants: [
      {
        grantDate: "2022-02-15",
        days: 12,
        usedDates: ["2022-03-01", "2022-10-10"],
      },
      { grantDate: "2023-02-15", days: 14, usedDates: ["2023-03-01"] },
      {
        grantDate: "2024-02-15",
        days: 16,
        usedDates: ["2024-03-01", "2024-05-10"],
      },
    ],
    total: 42,
    used: 5,
    leaveDates: [
      "2022-03-01",
      "2022-10-10",
      "2023-03-01",
      "2024-03-01",
      "2024-05-10",
    ],
    carryOver: 0,
  },
  {
    id: "002",
    lastName: "佐藤",
    firstName: "花子",
    joinedAt: "2022-07-01",
    grants: [
      {
        grantDate: "2023-07-01",
        days: 14,
        usedDates: ["2023-08-01", "2023-12-01"],
      },
      { grantDate: "2024-07-01", days: 16, usedDates: ["2024-08-01"] },
    ],
    total: 30,
    used: 3,
    leaveDates: ["2023-08-01", "2023-12-01", "2024-08-01"],
    carryOver: 0,
  },
  {
    id: "003",
    lastName: "田中",
    firstName: "一郎",
    joinedAt: "2023-11-20",
    grants: [{ grantDate: "2024-11-20", days: 16, usedDates: [] }],
    total: 16,
    used: 0,
    leaveDates: [],
    carryOver: 0,
  },
  {
    id: "004",
    lastName: "鈴木",
    firstName: "美咲",
    joinedAt: "2021-06-10",
    grants: [
      { grantDate: "2022-06-10", days: 12, usedDates: ["2022-07-01"] },
      {
        grantDate: "2023-06-10",
        days: 14,
        usedDates: ["2023-07-01", "2023-08-01", "2023-09-01"],
      },
      { grantDate: "2024-06-10", days: 16, usedDates: ["2024-07-01"] },
    ],
    total: 42,
    used: 5,
    leaveDates: [
      "2022-07-01",
      "2023-07-01",
      "2023-08-01",
      "2023-09-01",
      "2024-07-01",
    ],
    carryOver: 0,
  },
];

function App() {
  // 従業員一覧の状態
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  // 現在開いているモーダルの種類
  const [activeModal, setActiveModal] = useState<
    null | "add" | "edit" | "leaveDates"
  >(null);
  // 操作対象の従業員ID
  const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);
  // ガイドモーダルの開閉制御
  const guideDisclosure = useDisclosure();

  // 現在選択中の従業員データを取得
  const currentEmployee = activeEmployeeId
    ? employees.find((e) => e.id === activeEmployeeId) || null
    : null;

  // 従業員フォームの状態・バリデーション管理（カスタムフック）
  // form, handleChangeはこのファイル内では直接使わないため分割代入から除外
  const { setForm, idError, setIdError } = useEmployeeForm(
    activeModal === "edit" && currentEmployee
      ? currentEmployee
      : {
          id: "",
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

  // 有給取得日編集用の状態・ロジック（カスタムフック）
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

  // テーブルの「確認」ボタン押下時の処理
  const handleView = (id: string) => {
    setActiveEmployeeId(id); // 対象従業員IDをセット
    setActiveModal("leaveDates"); // 有給取得日モーダルを開く
    setEditDateIdx(null);
    setDateInput("");
  };
  // テーブルの「編集」ボタン押下時の処理
  const handleEdit = (id: string) => {
    const emp = employees.find((e) => e.id === id);
    if (emp) setForm(emp);
    setActiveEmployeeId(id);
    setActiveModal("edit");
    setIdError("");
  };
  // 「従業員追加」ボタン押下時の処理
  const handleAdd = () => {
    setForm({
      id: "",
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
  // モーダルを閉じる処理
  const handleCloseModal = () => {
    setActiveModal(null);
    setActiveEmployeeId(null);
    setEditDateIdx(null);
    setDateInput("");
    setIdError("");
  };

  // 画面描画
  return (
    // 画面全体のレイアウト
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
              idError
            ) {
              setIdError("全ての項目を正しく入力してください");
              return;
            }
            // 勤続年数から付与日数を自動計算
            const autoTotal = calcLeaveDays(form.joinedAt);
            const newEmp = { ...form, total: autoTotal };
            setEmployees([...employees, { ...newEmp }]);
            setForm({
              id: "",
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
              id: "",
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
            handleAddDate(date, (dates) =>
              setEmployees((prev) =>
                prev.map((e) =>
                  e.id === emp.id ? { ...e, leaveDates: dates } : e
                )
              )
            );
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
        />
      </Box>
    </Box>
  );
}

export default App;
