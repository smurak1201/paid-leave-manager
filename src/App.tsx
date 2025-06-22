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

// =============================
// 初期従業員データ（サンプル）
// =============================
// - 実運用時はAPI等で取得する想定
const initialEmployees: Employee[] = [
  // 1人目: 山田 太郎
  {
    id: 1,
    lastName: "山田",
    firstName: "太郎",
    joinedAt: "2021-02-15",
    grants: [
      {
        grantDate: "2022-02-15",
        days: 12,
        usedDates: [
          "2022-03-01",
          "2022-04-01",
          "2022-05-01",
          "2022-06-01",
          "2022-07-01",
          "2022-08-01",
          "2022-09-01",
          "2022-10-01",
          "2022-11-01",
          "2022-12-01",
          "2023-01-01",
        ],
      },
      { grantDate: "2023-02-15", days: 14, usedDates: [] },
      { grantDate: "2024-02-15", days: 16, usedDates: [] },
    ],
    total: 42,
    used: 11,
    leaveDates: [
      "2022-03-01",
      "2022-04-01",
      "2022-05-01",
      "2022-06-01",
      "2022-07-01",
      "2022-08-01",
      "2022-09-01",
      "2022-10-01",
      "2022-11-01",
      "2022-12-01",
      "2023-01-01",
    ],
    carryOver: 0,
  },
  // 2人目: 佐藤 花子
  {
    id: 2,
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
  // 3人目: 田中 一郎
  {
    id: 3,
    lastName: "田中",
    firstName: "一郎",
    joinedAt: "2023-11-20",
    grants: [{ grantDate: "2024-11-20", days: 16, usedDates: [] }],
    total: 16,
    used: 0,
    leaveDates: [],
    carryOver: 0,
  },
  // 4人目: 鈴木 美咲
  {
    id: 4,
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
  // 5人目: 高橋 健
  {
    id: 5,
    lastName: "高橋",
    firstName: "健",
    joinedAt: "2020-04-01",
    grants: [
      { grantDate: "2021-04-01", days: 10, usedDates: ["2021-05-10"] },
      {
        grantDate: "2022-04-01",
        days: 12,
        usedDates: ["2022-06-15", "2022-09-20"],
      },
      { grantDate: "2023-04-01", days: 14, usedDates: ["2023-07-01"] },
      { grantDate: "2024-04-01", days: 16, usedDates: [] },
    ],
    total: 52,
    used: 4,
    leaveDates: ["2021-05-10", "2022-06-15", "2022-09-20", "2023-07-01"],
    carryOver: 2,
  },
  // 6人目: 伊藤 彩
  {
    id: 6,
    lastName: "伊藤",
    firstName: "彩",
    joinedAt: "2022-01-15",
    grants: [
      { grantDate: "2023-01-15", days: 14, usedDates: ["2023-02-10"] },
      { grantDate: "2024-01-15", days: 16, usedDates: ["2024-03-05"] },
    ],
    total: 30,
    used: 2,
    leaveDates: ["2023-02-10", "2024-03-05"],
    carryOver: 0,
  },
  // 7人目: 渡辺 大輔
  {
    id: 7,
    lastName: "渡辺",
    firstName: "大輔",
    joinedAt: "2019-10-01",
    grants: [
      { grantDate: "2020-10-01", days: 10, usedDates: ["2020-11-01"] },
      { grantDate: "2021-10-01", days: 12, usedDates: ["2021-12-01"] },
      { grantDate: "2022-10-01", days: 14, usedDates: ["2022-11-01"] },
      { grantDate: "2023-10-01", days: 16, usedDates: ["2023-12-01"] },
      { grantDate: "2024-10-01", days: 18, usedDates: [] },
    ],
    total: 70,
    used: 4,
    leaveDates: ["2020-11-01", "2021-12-01", "2022-11-01", "2023-12-01"],
    carryOver: 5,
  },
  // 8人目: 中村 さくら
  {
    id: 8,
    lastName: "中村",
    firstName: "さくら",
    joinedAt: "2023-04-10",
    grants: [{ grantDate: "2024-04-10", days: 16, usedDates: ["2024-05-20"] }],
    total: 16,
    used: 1,
    leaveDates: ["2024-05-20"],
    carryOver: 0,
  },
  // 9人目: 小林 直樹
  {
    id: 9,
    lastName: "小林",
    firstName: "直樹",
    joinedAt: "2020-12-01",
    grants: [
      { grantDate: "2021-12-01", days: 12, usedDates: ["2022-01-10"] },
      { grantDate: "2022-12-01", days: 14, usedDates: ["2023-02-15"] },
      { grantDate: "2023-12-01", days: 16, usedDates: [] },
    ],
    total: 42,
    used: 2,
    leaveDates: ["2022-01-10", "2023-02-15"],
    carryOver: 1,
  },
  // 10人目: 加藤 美優
  {
    id: 10,
    lastName: "加藤",
    firstName: "美優",
    joinedAt: "2022-09-01",
    grants: [
      { grantDate: "2023-09-01", days: 14, usedDates: ["2023-10-01"] },
      { grantDate: "2024-09-01", days: 16, usedDates: [] },
    ],
    total: 30,
    used: 1,
    leaveDates: ["2023-10-01"],
    carryOver: 0,
  },
  // 11人目: 吉田 翔
  {
    id: 11,
    lastName: "吉田",
    firstName: "翔",
    joinedAt: "2021-03-20",
    grants: [
      { grantDate: "2022-03-20", days: 12, usedDates: ["2022-04-10"] },
      { grantDate: "2023-03-20", days: 14, usedDates: ["2023-05-01"] },
      { grantDate: "2024-03-20", days: 16, usedDates: [] },
    ],
    total: 42,
    used: 2,
    leaveDates: ["2022-04-10", "2023-05-01"],
    carryOver: 0,
  },
  // 12人目: 山本 里奈
  {
    id: 12,
    lastName: "山本",
    firstName: "里奈",
    joinedAt: "2023-06-01",
    grants: [{ grantDate: "2024-06-01", days: 16, usedDates: [] }],
    total: 16,
    used: 0,
    leaveDates: [],
    carryOver: 0,
  },
  // 13人目: 斎藤 拓海
  {
    id: 13,
    lastName: "斎藤",
    firstName: "拓海",
    joinedAt: "2020-08-15",
    grants: [
      { grantDate: "2021-08-15", days: 12, usedDates: ["2021-09-01"] },
      { grantDate: "2022-08-15", days: 14, usedDates: ["2022-10-01"] },
      { grantDate: "2023-08-15", days: 16, usedDates: ["2023-11-01"] },
      { grantDate: "2024-08-15", days: 18, usedDates: [] },
    ],
    total: 60,
    used: 3,
    leaveDates: ["2021-09-01", "2022-10-01", "2023-11-01"],
    carryOver: 2,
  },
  // 14人目: 森田 さやか
  {
    id: 14,
    lastName: "森田",
    firstName: "さやか",
    joinedAt: "2021-12-10",
    grants: [
      { grantDate: "2022-12-10", days: 14, usedDates: ["2023-01-10"] },
      { grantDate: "2023-12-10", days: 16, usedDates: [] },
    ],
    total: 30,
    used: 1,
    leaveDates: ["2023-01-10"],
    carryOver: 0,
  },
  // 15人目: 石井 亮
  {
    id: 15,
    lastName: "石井",
    firstName: "亮",
    joinedAt: "2022-03-01",
    grants: [
      { grantDate: "2023-03-01", days: 14, usedDates: ["2023-04-01"] },
      { grantDate: "2024-03-01", days: 16, usedDates: ["2024-04-01"] },
    ],
    total: 30,
    used: 2,
    leaveDates: ["2023-04-01", "2024-04-01"],
    carryOver: 0,
  },
  // 16人目: 上田 美穂
  {
    id: 16,
    lastName: "上田",
    firstName: "美穂",
    joinedAt: "2020-11-11",
    grants: [
      { grantDate: "2021-11-11", days: 12, usedDates: ["2022-01-11"] },
      { grantDate: "2022-11-11", days: 14, usedDates: ["2023-01-11"] },
      { grantDate: "2023-11-11", days: 16, usedDates: [] },
    ],
    total: 42,
    used: 2,
    leaveDates: ["2022-01-11", "2023-01-11"],
    carryOver: 1,
  },
];

function App() {
  // =============================
  // グローバル状態管理
  // =============================
  // 従業員一覧
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  // 従業員一覧テーブルのページ番号
  const [currentPage, setCurrentPage] = useState(1);
  // LeaveDatesModalのページ番号
  const [leaveDatesPage, setLeaveDatesPage] = useState(1);
  // 現在開いているモーダルの種類
  const [activeModal, setActiveModal] = useState<
    null | "add" | "edit" | "leaveDates"
  >(null);
  // 操作対象の従業員ID
  const [activeEmployeeId, setActiveEmployeeId] = useState<number | null>(null);
  // ガイドモーダルの開閉制御
  const guideDisclosure = useDisclosure();

  // =============================
  // 選択中従業員データ取得
  // =============================
  const currentEmployee =
    activeEmployeeId !== null
      ? employees.find((e) => e.id === activeEmployeeId) || null
      : null;

  // =============================
  // 従業員フォームの状態・バリデーション管理（カスタムフック）
  // =============================
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

  // =============================
  // 有給取得日編集用の状態・ロジック（カスタムフック）
  // =============================
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

  // =============================
  // UIイベントハンドラ
  // =============================
  // テーブルの「確認」ボタン押下時
  const handleView = (id: number) => {
    setActiveEmployeeId(id);
    setActiveModal("leaveDates");
    setEditDateIdx(null);
    setDateInput("");
  };
  // テーブルの「編集」ボタン押下時
  const handleEdit = (id: number) => {
    const emp = employees.find((e) => e.id === id);
    if (emp) setForm(emp);
    setActiveEmployeeId(id);
    setActiveModal("edit");
    setIdError("");
  };
  // 「従業員追加」ボタン押下時
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
  // モーダルを閉じる処理
  const handleCloseModal = () => {
    setActiveModal(null);
    setActiveEmployeeId(null);
    setEditDateIdx(null);
    setDateInput("");
    setIdError("");
  };

  // =============================
  // 画面描画
  // =============================
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
              employees.some((emp) => emp.id === form.id) // 追加: 重複チェック
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
