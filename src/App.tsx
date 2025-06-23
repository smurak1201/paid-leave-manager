// =============================
// App.tsx
// 有給休暇管理アプリのメインコンポーネント
// =============================
//
// 役割:
// ・全体の状態管理（従業員リスト、モーダル開閉、選択中の従業員IDなど）
// ・主要なUI部品（テーブル・モーダル等）の呼び出しとprops受け渡し
// ・カスタムフックによるフォーム・日付編集・バリデーションの共通化
// ・props/stateの流れは「idのみ渡し、データ参照はAppのstateから行う」
// ・日本の有給休暇制度に即したロジックをUI/UX重視で実装
//
// 設計意図:
// ・単方向データフロー、props/stateの最小化、カスタムフック活用、責務分離、型・バリデーション共通化、小コンポーネント化
// ・全てのprops/stateの流れ・UI部品の責務・業務ロジック・型定義・バリデーション・設計意図を日本語コメントで明記

// ===== import: 外部ライブラリ =====
import { useEffect, useState } from "react";
import { Box, Heading, Button, Flex, useDisclosure } from "@chakra-ui/react";

// ===== import: 型定義 =====
import type { Employee } from "./components/employee/types";
import type { LeaveUsage } from "./sampleData/dbSampleTables";

// ===== import: 従業員関連コンポーネント・ユーティリティ =====
import { EmployeeTable } from "./components/employee/EmployeeTable";
import { EmployeeModal } from "./components/employee/EmployeeModal";
import { LeaveDatesModal } from "./components/employee/LeaveDatesModal";
import { Icons } from "./components/employee/icons";

// ===== import: UI/ガイド =====
import { GuideModal } from "./components/ui/GuideModal";

// ===== import: カスタムフック =====
import { useEmployeeForm } from "./hooks/useEmployeeForm";

function App() {
  // --- グローバル状態管理 ---
  const [employees, setEmployees] = useState<Employee[]>([]); // ←API取得に変更
  const [leaveUsages, setLeaveUsages] = useState<LeaveUsage[]>([]); // API連携用に初期値を空配列に修正
  const [currentPage, setCurrentPage] = useState(1); // 従業員一覧テーブルのページ番号
  const [leaveDatesPage, setLeaveDatesPage] = useState(1); // 有給取得日モーダルのページ番号
  const [activeModal, setActiveModal] = useState<
    null | "add" | "edit" | "leaveDates"
  >(null); // 開いているモーダル種別
  const [activeEmployeeId, setActiveEmployeeId] = useState<number | null>(null); // 操作対象従業員ID
  const guideDisclosure = useDisclosure(); // ガイドモーダル開閉
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- 選択中従業員データ取得 ---
  const currentEmployee =
    activeEmployeeId !== null
      ? employees.find((e) => e.id === activeEmployeeId) || null
      : null;

  // --- 従業員フォームの状態・バリデーション管理（カスタムフック） ---
  // form, handleChangeはこのファイル内では直接使わず、分割代入から除外
  const { setForm, idError, setIdError } = useEmployeeForm(
    activeModal === "edit" && currentEmployee
      ? currentEmployee
      : {
          id: NaN,
          employeeCode: NaN,
          lastName: "",
          firstName: "",
          joinedAt: "",
        },
    employees,
    activeEmployeeId
  );

  // --- 有給取得日編集用の状態・ロジック（leaveUsages操作型に変更） ---
  const [editDateIdx, setEditDateIdx] = useState<number | null>(null);
  const [dateInput, setDateInput] = useState("");

  // 日付追加
  const handleAddDate = async (date: string) => {
    if (!activeEmployeeId) return;
    try {
      const res = await fetch("/paid_leave_manager/leave_usage_add.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: activeEmployeeId,
          used_date: date,
        }),
      });
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      // 追加後に最新の消化履歴を再取得
      fetch("/paid_leave_manager/leave_usages.php")
        .then((res) => res.json())
        .then((data) => setLeaveUsages(data));
      setDateInput("");
    } catch (e: any) {
      alert(e.message || "有給消化日の追加に失敗しました");
    }
  };
  // 日付削除
  const handleDeleteDate = async (idx: number) => {
    if (!activeEmployeeId) return;
    const empUsages = leaveUsages.filter(
      (u) => u.employeeId === activeEmployeeId
    );
    if (!empUsages[idx]) return;
    const target = empUsages[idx];
    try {
      await fetch(
        "http://localhost/paid_leave_manager/leave_usage_delete.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: target.id }),
        }
      );
      // 削除後に最新の消化履歴を再取得
      fetch("http://localhost/paid_leave_manager/leave_usages.php")
        .then((res) => res.json())
        .then((data) =>
          setLeaveUsages(
            data.map((u: any) => ({
              ...u,
              employeeId: u.employee_id,
              usedDate: u.used_date,
            }))
          )
        );
    } catch (e: any) {
      alert(e.message || "有給消化日の削除に失敗しました");
    }
  };

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
      employeeCode: NaN,
      lastName: "",
      firstName: "",
      joinedAt: "",
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
      employeeCode: NaN,
      lastName: "",
      firstName: "",
      joinedAt: "",
    });
  };

  // 従業員一覧・有給消化履歴APIから取得
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost/paid_leave_manager/employees.php").then(
        async (res) => {
          const text = await res.text();
          let data = [];
          try {
            data = JSON.parse(text).map((emp: any) => ({
              ...emp,
              joinedAt: emp.joined_at,
              lastName: emp.last_name,
              firstName: emp.first_name,
            }));
          } catch (err) {
            setError("従業員APIレスポンスが不正です: " + text.slice(0, 200));
          }
          return data;
        }
      ),
      fetch("http://localhost/paid_leave_manager/leave_usages.php").then(
        async (res) => {
          const text = await res.text();
          let data = [];
          try {
            data = JSON.parse(text).map((u: any) => ({
              ...u,
              employeeId: u.employee_id,
              usedDate: u.used_date,
            }));
          } catch (err) {
            setError("消化履歴APIレスポンスが不正です: " + text.slice(0, 200));
          }
          return data;
        }
      ),
    ])
      .then(([employeesData, leaveUsagesData]) => {
        setEmployees(employeesData);
        setLeaveUsages(leaveUsagesData);
        setLoading(false);
      })
      .catch((e) => {
        setError("データの取得に失敗しました: " + (e.message || e));
        setLoading(false);
      });
  }, []);

  // --- 有給サマリー・詳細のAPI連携 ---
  const [summary, setSummary] = useState({
    grantThisYear: 0,
    carryOver: 0,
    used: 0,
    remain: 0,
  });
  const [grantDetails, setGrantDetails] = useState([]);
  useEffect(() => {
    if (!activeEmployeeId || activeModal !== "leaveDates") return;
    fetch(
      `http://localhost/paid_leave_manager/leave_summary.php?employee_id=${activeEmployeeId}`
    ).then(async (res) => {
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        setSummary({
          grantThisYear: data.grantThisYear,
          carryOver: data.carryOver,
          used: data.used,
          remain: data.remain,
        });
        setGrantDetails(data.grantDetails || []);
      } catch (err) {
        setSummary({ grantThisYear: 0, carryOver: 0, used: 0, remain: 0 });
        setGrantDetails([]);
      }
    });
  }, [activeEmployeeId, activeModal]);

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
        {loading ? (
          <Box textAlign="center" py={10}>
            <Icons.Loader className="animate-spin" size={24} />
          </Box>
        ) : error ? (
          <Box color="red.500" textAlign="center" py={10}>
            {error}
          </Box>
        ) : (
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
        )}
        {/* 従業員追加・編集モーダル */}
        <EmployeeModal
          isOpen={activeModal === "add" || activeModal === "edit"}
          onClose={handleCloseModal}
          employeeId={activeModal === "add" ? null : activeEmployeeId}
          getEmployee={(id) => employees.find((e) => e.id === id)}
          onAdd={async (form) => {
            // 入力バリデーション
            if (
              !form.id ||
              !form.employeeCode ||
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
            try {
              await fetch("http://localhost/paid_leave_manager/employees.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: form.id,
                  employee_code: form.employeeCode,
                  last_name: form.lastName,
                  first_name: form.firstName,
                  joined_at: form.joinedAt,
                  mode: "add",
                }),
              });
              // 追加後に再取得
              const res = await fetch(
                "http://localhost/paid_leave_manager/employees.php"
              );
              const text = await res.text();
              let data = [];
              try {
                data = JSON.parse(text).map((emp: any) => ({
                  ...emp,
                  joinedAt: emp.joined_at,
                  lastName: emp.last_name,
                  firstName: emp.first_name,
                }));
              } catch (err) {}
              setEmployees(data);
              // 追加後に最終ページへ移動
              const ITEMS_PER_PAGE = 15;
              const newTotal = data.length;
              setCurrentPage(Math.ceil(newTotal / ITEMS_PER_PAGE));
              setForm({
                id: NaN,
                employeeCode: NaN,
                lastName: "",
                firstName: "",
                joinedAt: "",
              });
              setActiveEmployeeId(null);
              setActiveModal(null);
            } catch (e: any) {
              setIdError(e.message || "従業員追加に失敗しました");
            }
          }}
          onSave={async (form) => {
            // 入力バリデーション
            if (
              !form.id ||
              !form.employeeCode ||
              !form.lastName ||
              !form.firstName ||
              !form.joinedAt ||
              idError
            ) {
              setIdError("全ての項目を正しく入力してください");
              return;
            }
            try {
              await fetch("http://localhost/paid_leave_manager/employees.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: form.id,
                  employee_code: form.employeeCode,
                  last_name: form.lastName,
                  first_name: form.firstName,
                  joined_at: form.joinedAt,
                  mode: "edit",
                }),
              });
              // 編集後に再取得
              const res = await fetch(
                "http://localhost/paid_leave_manager/employees.php"
              );
              const text = await res.text();
              let data = [];
              try {
                data = JSON.parse(text).map((emp: any) => ({
                  ...emp,
                  joinedAt: emp.joined_at,
                  lastName: emp.last_name,
                  firstName: emp.first_name,
                }));
              } catch (err) {}
              setEmployees(data);
              setForm({
                id: NaN,
                employeeCode: NaN,
                lastName: "",
                firstName: "",
                joinedAt: "",
              });
              setActiveEmployeeId(null);
              setActiveModal(null);
            } catch (e: any) {
              setIdError(e.message || "従業員編集に失敗しました");
            }
          }}
          onDelete={async (id) => {
            try {
              await fetch("http://localhost/paid_leave_manager/employees.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, mode: "delete" }),
              });
              // 削除後に再取得
              const res = await fetch(
                "http://localhost/paid_leave_manager/employees.php"
              );
              const text = await res.text();
              let data = [];
              try {
                data = JSON.parse(text).map((emp: any) => ({
                  ...emp,
                  joinedAt: emp.joined_at,
                  lastName: emp.last_name,
                  firstName: emp.first_name,
                }));
              } catch (err) {}
              setEmployees(data);
            } catch (e: any) {
              setIdError(e.message || "従業員削除に失敗しました");
            }
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
          leaveUsages={leaveUsages}
          onAddDate={handleAddDate}
          onDeleteDate={handleDeleteDate}
          editDateIdx={editDateIdx}
          setEditDateIdx={setEditDateIdx}
          dateInput={dateInput}
          setDateInput={setDateInput}
          currentPage={leaveDatesPage}
          onPageChange={setLeaveDatesPage}
          summary={summary}
          grantDetails={grantDetails}
        />
      </Box>
    </Box>
  );
}

export default App;
