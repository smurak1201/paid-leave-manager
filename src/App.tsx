// --- 起動時にサーバー側の認証状態を検証し、無効なら自動ログアウト ---
useEffect(() => {
  // useEffect内でauth, setAuthを参照するため、関数本体の直後に記述
  if (!auth) return;
  apiGet(
    "http://172.18.119.226:8000/api/employees",
    auth.token ? { Authorization: `Bearer ${auth.token}` } : undefined
  ).catch((e) => {
    if (e.message && e.message.includes("401")) {
      setAuth(null);
      sessionStorage.removeItem("auth");
    }
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [auth]);
// =====================================================
// App.tsx
// -----------------------------------------------------
// このファイルは「有給休暇管理アプリ」のメインコンポーネントです。
// 主な役割:
//   - 従業員・有給取得日など全体の状態管理
//   - 主要なUI部品（テーブル・モーダル等）の呼び出しとprops受け渡し
//   - API通信やバリデーションなど業務ロジックの集約
// 設計意図:
//   - 単方向データフロー、状態の一元管理、責務分離
//   - props/stateの流れ・UI部品の責務・業務ロジック・型定義を日本語コメントで明記
//   - 学習用途でも可読性・責務分離・型安全を重視
// 使い方:
//   - 主要な状態・ロジックはApp.tsx内で完結し、UI部品には必要なstate/関数のみをpropsで渡す
//   - 各stateや関数の役割は日本語コメントで明記
// =====================================================

// ===== import: 外部ライブラリ =====
import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
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
import { editEmployee, deleteEmployee } from "./api/employeeApi";
import { addLeaveUsage } from "./api/leaveUsageApi";

function App() {
  // ====== すべてのフックはトップレベルで宣言 ======
  const [auth, setAuth] = useState<{
    token: string;
    role: string;
    employee_id: number | null;
  } | null>(() => {
    // セッションストレージから復元
    const saved = sessionStorage.getItem("auth");
    return saved ? JSON.parse(saved) : null;
  });
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
  // --- 追加: サマリー・有給日編集用のstate ---
  const [summaries, setSummaries] = useState<EmployeeSummary[]>([]);
  const [editDateIdx, setEditDateIdx] = useState<number | null>(null);
  const [dateInput, setDateInput] = useState("");
  const [addDateError, setAddDateError] = useState("");

  // --- データ取得・更新用関数 ---
  // 従業員一覧を従業員コード（employeeId）の昇順で返す
  const API_BASE = "http://172.18.119.226:8000";
  const fetchEmployees = async () => {
    const data = await apiGet<any[]>(
      `${API_BASE}/api/employees`,
      auth?.token ? { Authorization: `Bearer ${auth.token}` } : undefined
    );
    return data
      .map((emp: any) => ({
        ...emp,
        employeeId: Number(emp.employee_id),
        joinedAt: emp.joined_at,
        lastName: emp.last_name,
        firstName: emp.first_name,
      }))
      .sort((a, b) => a.employeeId - b.employeeId);
  };

  // 有給取得日の取得
  const fetchLeaveUsages = async () => {
    const data = await apiGet<any[]>(
      `${API_BASE}/api/leave-usages`,
      auth?.token ? { Authorization: `Bearer ${auth.token}` } : undefined
    );
    return data.map((u: any) => ({
      id: u.id,
      employeeId: Number(u.employee_id),
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
            `${API_BASE}/api/leave-summary?employee_id=${emp.employeeId}`,
            auth?.token ? { Authorization: `Bearer ${auth.token}` } : undefined
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

  // --- 初回データ取得（認証済みのときのみ） ---
  useEffect(() => {
    if (!auth) return;
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
  }, [auth]);

  // --- サマリー再取得 ---
  useEffect(() => {
    if (employees.length === 0) return;
    fetchSummaries(employees).then((summaries) => {
      setSummaries(summaries);
    });
  }, [employees]);

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
      await deleteEmployee(employeeId);
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
      await addLeaveUsage(employeeId, date); // ← 共通APIユーティリティ経由に修正
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

  // --- 有給取得日削除ロジック（RESTful: id指定） ---
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
    // 対象のLeaveUsage（id）を特定
    const targetUsage = leaveUsages.find(
      (u) => u.employeeId === emp.employeeId && u.usedDate === targetDate
    );
    if (!targetUsage) {
      alert("該当する有給消化履歴が見つかりません");
      return false;
    }
    try {
      // RESTful DELETE: id指定
      const { deleteLeaveUsage } = await import("./api/leaveUsageApi");
      await deleteLeaveUsage(targetUsage.id);
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
      await apiPost("http://172.18.119.226:8000/api/employees", {
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
      await editEmployee({
        id: form.id,
        employeeId: form.employeeId,
        lastName: form.lastName,
        firstName: form.firstName,
        joinedAt: form.joinedAt,
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

  // --- 認証状態の永続化 ---
  // authが変化したらセッションストレージに保存
  useEffect(() => {
    if (auth) {
      sessionStorage.setItem("auth", JSON.stringify(auth));
    } else {
      sessionStorage.removeItem("auth");
    }
  }, [auth]);

  // --- 画面描画 ---
  if (!auth) {
    return <LoginForm onLoginSuccess={setAuth} />;
  }
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
        <Flex mb={6} justify="space-between" gap={4}>
          {/* 左側：ログアウトボタン */}
          <Button
            colorScheme="red"
            variant="outline"
            onClick={() => {
              setAuth(null);
              // セッションストレージもクリア
              sessionStorage.removeItem("auth");
            }}
            size="md"
            px={6}
            boxShadow="md"
          >
            ログアウト
          </Button>
          {/* 右側：ガイド・従業員追加ボタン */}
          <Flex gap={4}>
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
