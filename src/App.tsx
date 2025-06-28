// =============================
// App.tsx
// 有給休暇管理アプリのメインコンポーネント
// =============================
//
// 役割:
// ・従業員・有給取得日など全体の状態管理
// ・主要なUI部品（テーブル・モーダル等）の呼び出しとprops受け渡し
// ・API通信やバリデーションなど業務ロジックの集約
//
// 設計意図:
// ・単方向データフロー、状態の一元管理、責務分離
// ・props/stateの流れ・UI部品の責務・業務ロジック・型定義を日本語コメントで明記
//
// propsに渡す関数や値は、できるだけシンプルな形で記述し、
// 状態やロジックの流れが追いやすいようにしています。
//
// 各stateや関数の役割:
// ・employees, leaveUsages, summaries: データの主な状態
// ・currentPage, leaveDatesPage: ページネーション用
// ・activeModal, activeEmployeeId: モーダル・選択中従業員の管理
// ・editDateIdx, dateInput, addDateError: 有給日編集用の一時状態
// ・handleAddEmployee, handleSaveEmployee, handleDeleteEmployee: 従業員の追加・編集・削除処理
// ・handleAddDate, handleDeleteDate: 有給取得日の追加・削除処理
// ・getSummary, getUsedDates, getGrantDetails: サマリー・日付リスト取得用のヘルパー
//
// UI部品には、必要なstate・関数のみをpropsで渡し、
// それ以外のロジックはApp.tsx内で完結させています。

// ===== import: 外部ライブラリ =====
import { useEffect, useState } from "react";
import { Box, Heading, Button, Flex, useDisclosure } from "@chakra-ui/react";

// ===== import: 型定義 =====
import type { Employee } from "./types/employee";
import type { LeaveUsage } from "./types/leaveUsage";

// ===== import: 従業員関連コンポーネント・ユーティリティ =====
import { EmployeeTable } from "./components/employee/EmployeeTable";
import { EmployeeModal } from "./components/employee/EmployeeModal";
import { LeaveDatesModal } from "./components/employee/LeaveDatesModal";
import { Icons } from "./components/employee/icons";

// ===== import: UI/ガイド =====
import { GuideModal } from "./components/ui/GuideModal";

// ===== import: API =====
import { apiGet, apiPost } from "./api";

function App() {
  // --- グローバル状態管理 ---
  const [employees, setEmployees] = useState<Employee[]>([]); // 従業員リスト
  const [leaveUsages, setLeaveUsages] = useState<LeaveUsage[]>([]); // 有給取得日リスト
  const [currentPage, setCurrentPage] = useState(1); // 現在のページ番号
  const [leaveDatesPage, setLeaveDatesPage] = useState(1); // 有給取得日の現在のページ番号
  const [activeModal, setActiveModal] = useState<
    null | "add" | "edit" | "leaveDates"
  >(null); // アクティブなモーダルの状態
  const [activeEmployeeId, setActiveEmployeeId] = useState<number | null>(null); // アクティブな従業員ID
  const guideDisclosure = useDisclosure(); // ガイドモーダルの開閉状態管理
  const [loading, setLoading] = useState(true); // データ読み込み中フラグ
  const [error, setError] = useState(""); // エラーメッセージ

  // --- データ取得・更新用関数 ---
  const fetchEmployees = async () => {
    const data = await apiGet<any[]>("http://localhost:8000/api/employees");
    return data.map((emp: any) => ({
      ...emp,
      employeeId: Number(emp.employee_id), // number型で持つ
      joinedAt: emp.joined_at, // 入社日は文字列型
      lastName: emp.last_name, // 姓は文字列型
      firstName: emp.first_name, // 名は文字列型
    }));
  };

  // 有給取得日の取得
  const fetchLeaveUsages = async () => {
    const data = await apiGet<any[]>("http://localhost:8000/api/leave-usages");
    return data.map((u: any) => ({
      ...u,
      employeeId: Number(u.employee_id), // number型で持つ
      usedDate: u.used_date,
    }));
  };
  type EmployeeSummary = {
    employeeId: number; // 従業員ID
    grantThisYear: number; // 今年の付与日数
    carryOver: number; // 繰越日数
    used: number; // 今年使用した日数
    remain: number; // 残り日数
    usedDates: string[]; // 今年使用した日付のリスト
    grantDetails?: Array<{
      // 付与の詳細情報
      grantDate: string; // 付与日
      days: number; // 付与日数
      used: number; // 使用済み日数
      remain: number; // 残り日数
      usedDates: string[]; // 使用した日付のリスト
    }>;
  };

  // 従業員ごとの有給休暇サマリーを取得
  const fetchSummaries = async (emps: Employee[]) => {
    return Promise.all(
      emps.map(async (emp) => {
        try {
          const data = await apiGet<any>(
            `http://localhost:8000/api/leave-summary?employee_id=${emp.employeeId}`
          );
          return {
            employeeId: emp.employeeId,
            grantThisYear: data.grantThisYear ?? 0,
            carryOver: data.carryOver ?? 0,
            used: data.used ?? 0,
            remain: data.remain ?? 0,
            usedDates: data.usedDates ?? [],
            grantDetails: data.grantDetails ?? [],
          };
        } catch {
          return {
            employeeId: emp.employeeId,
            grantThisYear: 0,
            carryOver: 0,
            used: 0,
            remain: 0,
            usedDates: [],
            grantDetails: [],
          };
        }
      })
    );
  };

  // データ再取得をまとめて行う関数
  const reloadAll = async () => {
    const employeesList = await fetchEmployees(); // 従業員リストを取得
    setEmployees(employeesList); // 従業員リストを更新
    setLeaveUsages(await fetchLeaveUsages()); // 有給取得日を更新
    setSummaries(await fetchSummaries(employeesList)); // サマリーを更新
    return employeesList; // 更新後の従業員リストを返す
  };
  // サマリーのデフォルト値
  const emptySummary = {
    grantThisYear: 0,
    carryOver: 0,
    used: 0,
    remain: 0,
    usedDates: [],
  };

  // --- 初回データ取得 ---
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchEmployees(), fetchLeaveUsages()])
      .then(([emps, usages]) => {
        setEmployees(emps);
        setLeaveUsages(usages);
        setLoading(false);
        setError("");
      })
      .catch((e) => {
        setError("データの取得に失敗しました: " + (e.message || e));
        setLoading(false);
      });
  }, []);

  // --- サマリー再取得 ---
  const [summaries, setSummaries] = useState<EmployeeSummary[]>([]);
  useEffect(() => {
    if (employees.length === 0) return;
    fetchSummaries(employees).then(setSummaries);
  }, [employees]);

  // --- 有給取得日編集用の状態・ロジック ---
  const [editDateIdx, setEditDateIdx] = useState<number | null>(null);
  const [dateInput, setDateInput] = useState("");
  const [addDateError, setAddDateError] = useState("");

  // --- 従業員編集モーダルを開く ---
  const handleEdit = (employeeId: number) => {
    setActiveEmployeeId(employeeId);
    setActiveModal("edit");
  };

  // 従業員IDから従業員オブジェクトを取得
  const findEmployee = (id: number | null) =>
    employees.find((e) => e.employeeId === id) ?? null;

  // --- 従業員の有給取得日確認モーダルを開く ---
  const handleView = (employeeId: number) => {
    setActiveEmployeeId(employeeId);
    setActiveModal("leaveDates");
  };

  // --- 従業員削除ロジック ---
  const handleDeleteEmployee = async (employeeId: number) => {
    try {
      // 先に有給取得日を全て削除
      const emp = findEmployee(employeeId);
      if (emp) {
        const usages = leaveUsages.filter(
          (u) => u.employeeId === emp.employeeId
        );
        for (const usage of usages) {
          await apiPost(
            "http://localhost/paid_leave_manager/leave_usage_delete.php",
            { employee_id: emp.employeeId, used_date: usage.usedDate }
          );
        }
      }
      // 従業員本体を削除
      await apiPost("http://localhost/paid_leave_manager/employees.php", {
        employee_id: employeeId,
        mode: "delete",
      });
      await reloadAll();
    } catch (e: any) {
      alert(e.message || "従業員削除に失敗しました");
    }
  };

  // --- 有給取得日追加ロジック ---
  const handleAddDate = async (employeeId: number | null, date: string) => {
    if (employeeId == null) return;
    setAddDateError("");
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setAddDateError("日付を正しく入力してください");
      return;
    }
    // 既存の有給取得日と重複していないかチェック
    const usedDates = leaveUsages
      .filter((u) => u.employeeId === employeeId)
      .map((u) => u.usedDate);
    if (usedDates.includes(date)) {
      setAddDateError("同じ有給取得日がすでに登録されています");
      return;
    }
    try {
      await apiPost("http://localhost/paid_leave_manager/leave_usage_add.php", {
        employee_id: Number(employeeId),
        used_date: date,
      });
      await reloadAll();
      setDateInput("");
    } catch (e: any) {
      let msg = e?.message || "有給消化日の追加に失敗しました";
      if (msg.includes("400") || msg.includes("before joined")) {
        msg = "入社日より前の日付は登録できません";
      } else if (msg.includes("duplicate")) {
        msg = "同じ有給取得日がすでに登録されています";
      }
      setAddDateError(msg);
    }
  };

  // --- 有給取得日削除ロジック ---
  const handleDeleteDate = async (employeeId: number | null, idx: number) => {
    const emp = findEmployee(employeeId);
    if (!emp) return false;
    // 表示しているusedDates（有効期限内のみ）を取得
    const empSummary = summaries.find((s) => s.employeeId === emp.employeeId);
    const visibleUsedDates = empSummary?.usedDates ?? [];
    const targetDate = visibleUsedDates[idx];
    if (!targetDate) {
      return false;
    }
    try {
      await apiPost(
        "http://localhost/paid_leave_manager/leave_usage_delete.php",
        { employee_id: emp.employeeId, used_date: targetDate }
      );
      await reloadAll();
      return true;
    } catch (e: any) {
      alert(e.message || "有給消化日の削除に失敗しました");
      return false;
    }
  };

  // --- 従業員追加・編集ロジック ---
  const handleAddEmployee = async (form: any) => {
    try {
      await apiPost("http://localhost/paid_leave_manager/employees.php", {
        employee_id: form.employeeId,
        last_name: form.lastName,
        first_name: form.firstName,
        joined_at: form.joinedAt,
        mode: "add",
      });
      const employeesList = await reloadAll();
      const ITEMS_PER_PAGE = 15;
      setCurrentPage(Math.ceil(employeesList.length / ITEMS_PER_PAGE));
      setActiveEmployeeId(null);
      setActiveModal(null);
    } catch (e: any) {
      alert(e.message || "従業員追加に失敗しました");
    }
  };
  const handleSaveEmployee = async (form: any) => {
    try {
      await apiPost("http://localhost/paid_leave_manager/employees.php", {
        id: form.id,
        employee_id: form.employeeId,
        last_name: form.lastName,
        first_name: form.firstName,
        joined_at: form.joinedAt,
        mode: "edit",
      });
      await reloadAll();
      setActiveEmployeeId(null);
      setActiveModal(null);
    } catch (e: any) {
      alert(e.message || "従業員編集に失敗しました");
    }
  };

  // --- summary, usedDates, grantDetailsのgetter関数を分離 ---
  const getSummary = (
    activeEmployeeId: number | null,
    employees: Employee[],
    summaries: EmployeeSummary[],
    emptySummary: any
  ) => {
    const emp = employees.find((e) => e.employeeId === activeEmployeeId);
    const s = summaries.find((s) => s.employeeId === (emp?.employeeId ?? null));
    return s || emptySummary;
  };

  const getUsedDates = (
    activeEmployeeId: number | null,
    summaries: EmployeeSummary[]
  ) => {
    const empSummary = summaries.find((s) => s.employeeId === activeEmployeeId);
    return empSummary?.usedDates ?? [];
  };

  const getGrantDetails = (
    activeEmployeeId: number | null,
    summaries: EmployeeSummary[]
  ) => {
    const empSummary = summaries.find((s) => s.employeeId === activeEmployeeId);
    if (empSummary && empSummary.grantDetails) {
      return empSummary.grantDetails.map((g) => ({
        ...g,
        usedDates: Array.isArray(g.usedDates)
          ? g.usedDates.filter(Boolean)
          : [],
      }));
    }
    return [];
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
        <Heading
          mb={8}
          color="teal.700"
          textAlign="center"
          fontWeight="bold"
          letterSpacing={2}
        >
          有給休暇管理
        </Heading>
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
            onClick={() => {
              setActiveEmployeeId(null);
              setActiveModal("add");
            }}
            size="md"
            px={6}
            boxShadow="md"
          >
            <Icons.Plus size={18} style={{ marginRight: 6 }} />
            従業員追加
          </Button>
        </Flex>
        <GuideModal
          open={guideDisclosure.open}
          onClose={guideDisclosure.onClose}
        />
        {loading ? (
          <Flex align="center" justify="center" minH="300px">
            <Icons.Loader className="animate-spin" size={24} />
          </Flex>
        ) : error ? (
          <Box color="red.500" textAlign="center" py={10}>
            {error}
          </Box>
        ) : (
          <EmployeeTable
            employees={employees}
            summaries={summaries}
            onEdit={handleEdit}
            onDelete={handleDeleteEmployee}
            onView={handleView}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <EmployeeModal
          isOpen={activeModal === "add" || activeModal === "edit"}
          onClose={() => setActiveModal(null)}
          employee={
            activeModal === "edit" ? findEmployee(activeEmployeeId) : null
          }
          employees={employees}
          onAdd={handleAddEmployee}
          onSave={handleSaveEmployee}
        />
        <LeaveDatesModal
          key={activeEmployeeId ?? "none"}
          isOpen={activeModal === "leaveDates"}
          onClose={() => setActiveModal(null)}
          employeeId={activeEmployeeId}
          leaveUsages={leaveUsages}
          onAddDate={(date) => handleAddDate(activeEmployeeId, date)}
          onDeleteDate={(idx) => handleDeleteDate(activeEmployeeId, idx)}
          editDateIdx={editDateIdx}
          setEditDateIdx={setEditDateIdx}
          dateInput={dateInput}
          setDateInput={setDateInput}
          currentPage={leaveDatesPage}
          onPageChange={setLeaveDatesPage}
          summary={getSummary(
            activeEmployeeId,
            employees,
            summaries,
            emptySummary
          )}
          usedDates={getUsedDates(activeEmployeeId, summaries)}
          grantDetails={getGrantDetails(activeEmployeeId, summaries)}
          addDateError={addDateError}
        />
      </Box>
    </Box>
  );
}

export default App;
