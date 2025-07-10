// =====================================================
// App.tsx
// -----------------------------------------------------
// 【有給休暇管理アプリ】メインコンポーネント
// -----------------------------------------------------
// ▼主な役割
//   - 従業員・有給取得日など全体の状態管理
//   - 主要なUI部品（テーブル・モーダル等）の呼び出しとprops受け渡し
//   - API通信やバリデーションなど業務ロジックの集約
// ▼設計意図
//   - 単方向データフロー、状態の一元管理、責務分離
//   - props/stateの流れ・UI部品の責務・業務ロジック・型定義を日本語コメントで明記
//   - 学習用途でも可読性・責務分離・型安全を重視
// ▼使い方
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
  // ===============================
  // ▼アプリ全体の状態管理（useState）
  // ===============================
  // 認証情報（トークン・権限・従業員ID）
  const [auth, setAuth] = useState<{
    token: string;
    role: string;
    employee_id: string | null;
  } | null>(() => {
    // セッションストレージから復元（リロード時もログイン状態を保持）
    const saved = sessionStorage.getItem("auth");
    return saved ? JSON.parse(saved) : null;
  });

  // 従業員リスト
  const [employees, setEmployees] = useState<Employee[]>([]);
  // 有給取得日リスト
  const [leaveUsages, setLeaveUsages] = useState<LeaveUsage[]>([]);
  // 従業員一覧のページ番号
  const [currentPage, setCurrentPage] = useState(1);
  // 有給取得日一覧のページ番号
  const [leaveDatesPage, setLeaveDatesPage] = useState(1);
  // アクティブなモーダル（add:追加, edit:編集, leaveDates:有給日一覧）
  const [activeModal, setActiveModal] = useState<
    null | "add" | "edit" | "leaveDates"
  >(null);
  // 編集・参照対象の従業員ID
  const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);
  // ガイドモーダルの開閉状態
  const guideDisclosure = useDisclosure();
  // データ読み込み中フラグ
  const [loading, setLoading] = useState(true);
  // エラーメッセージ
  const [error, setError] = useState("");
  // サマリー情報（従業員ごとの有給付与・消化状況）
  const [summaries, setSummaries] = useState<EmployeeSummary[]>([]);
  // 有給日編集用のインデックス
  const [editDateIdx, setEditDateIdx] = useState<number | null>(null);
  // 有給日入力欄の値
  const [dateInput, setDateInput] = useState("");
  // 有給日追加時のエラー
  const [addDateError, setAddDateError] = useState("");

  // ===============================
  // ▼認証状態の検証（useEffect）
  // ===============================
  // 起動時にサーバー側の認証状態を検証し、無効なら自動ログアウト
  useEffect(() => {
    if (!auth) return;
    // APIエンドポイントは環境変数から取得
    const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || "";
    apiGet(
      `${API_BASE}/api/employees`,
      auth.token ? { Authorization: `Bearer ${auth.token}` } : undefined
    ).catch((e) => {
      if (e.message && e.message.includes("401")) {
        setAuth(null);
        sessionStorage.removeItem("auth");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  // LeaveDatesModalを開くたびにエラー・入力値をリセット
  useEffect(() => {
    if (activeModal === "leaveDates") {
      setAddDateError("");
      setDateInput("");
    }
  }, [activeModal, activeEmployeeId]);

  // ===============================
  // ▼API通信・データ取得/更新ロジック
  // ===============================
  // APIのベースURL
  // APIエンドポイントのベースURLは環境変数から取得
  const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || "";

  // --- 従業員一覧を取得（employeeId昇順） ---
  // ポイント: APIから取得したデータをフロント用の型に整形
  const fetchEmployees = async () => {
    const data = await apiGet<any[]>(
      `${API_BASE}/api/employees`,
      auth?.token ? { Authorization: `Bearer ${auth.token}` } : undefined
    );
    return data
      .filter((emp: any) => emp.role !== "admin")
      .map((emp: any) => ({
        ...emp,
        employeeId: emp.employee_id,
        joinedAt: emp.joined_at,
        lastName: emp.last_name,
        firstName: emp.first_name,
      }))
      .sort((a, b) => (a.employeeId > b.employeeId ? 1 : -1));
  };

  // --- 有給取得日一覧を取得 ---
  // ポイント: APIのレスポンスをフロント用の型に変換
  const fetchLeaveUsages = async () => {
    const data = await apiGet<any[]>(
      `${API_BASE}/api/leave-usages`,
      auth?.token ? { Authorization: `Bearer ${auth.token}` } : undefined
    );
    return data.map((u: any) => ({
      id: u.id,
      employeeId: u.employee_id,
      usedDate: u.used_date,
    }));
  };

  // --- サマリー型定義 ---
  type EmployeeSummary = {
    employeeId: string; // 従業員ID
    grantThisYear: number; // 今年の付与日数
    carryOver: number; // 繰越日数
    used: number; // 今年使用した日数
    remain: number; // 残り日数
    usedDates: string[]; // 今年使用した日付のリスト
    grantDetails?: Array<{
      grantDate: string; // 付与日
      days: number; // 付与日数
      used: number; // 使用済み日数
      remain: number; // 残り日数
      usedDates: string[]; // 使用した日付のリスト
    }>;
  };

  // --- 従業員ごとの有給休暇サマリーを取得 ---
  // ポイント: 各従業員ごとにAPIを呼び出し、サマリー情報を集約
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
          // エラー時は空のサマリーを返す
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

  // --- データ再取得をまとめて行う関数 ---
  // ポイント: 従業員・有給日・サマリーを一括で再取得
  const reloadAll = async () => {
    const employeesList = await fetchEmployees();
    setEmployees(employeesList);
    setLeaveUsages(await fetchLeaveUsages());
    setSummaries(await fetchSummaries(employeesList));
    return employeesList;
  };

  // --- サマリーのデフォルト値 ---
  const emptySummary = {
    grantThisYear: 0,
    carryOver: 0,
    used: 0,
    remain: 0,
    usedDates: [],
  };

  // ===============================
  // ▼初回データ取得・サマリー再取得（useEffect）
  // ===============================
  // 認証済みのときのみ初回データ取得
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

  // 従業員リストが変化したらサマリーも再取得
  useEffect(() => {
    if (employees.length === 0) return;
    fetchSummaries(employees).then((summaries) => {
      setSummaries(summaries);
    });
  }, [employees]);

  // ===============================
  // ▼UI操作系ロジック
  // ===============================
  // 従業員編集モーダルを開く
  const handleEdit = (employeeId: string) => {
    setActiveEmployeeId(employeeId);
    setActiveModal("edit");
  };

  // 従業員IDから従業員オブジェクトを取得
  const findEmployee = (id: string | null) =>
    employees.find((e) => e.employeeId === id) ?? null;

  // 従業員の有給取得日確認モーダルを開く
  const handleView = (employeeId: string) => {
    setActiveEmployeeId(employeeId);
    setActiveModal("leaveDates");
  };

  // ===============================
  // ▼業務ロジック（CRUD操作）
  // ===============================

  // --- 従業員削除 ---
  // ポイント: 認証ヘッダーを付与し、削除後は一覧を再取得
  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      await deleteEmployee(
        employeeId,
        auth?.token ? { Authorization: `Bearer ${auth.token}` } : undefined
      );
      await reloadAll();
    } catch (e: any) {
      alert(e.message || "従業員削除に失敗しました");
    }
  };

  // --- 有給取得日追加 ---
  // ポイント: 入力バリデーション・重複チェック・API呼び出し
  const handleAddDate = async (employeeId: string | null, date: string) => {
    if (!employeeId) return;
    setAddDateError("");
    // 日付形式チェック
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
      await addLeaveUsage(
        employeeId,
        date,
        auth?.token ? { Authorization: `Bearer ${auth.token}` } : undefined
      );
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

  // --- 有給取得日削除 ---
  // ポイント: RESTfulなid指定・認証ヘッダー付与
  const handleDeleteDate = async (employeeId: string | null, idx: number) => {
    const emp = findEmployee(employeeId);
    if (!emp) return false;
    // 表示しているusedDates（有効期限内のみ）を取得
    const empSummary = summaries.find((s) => s.employeeId === emp.employeeId);
    const visibleUsedDates = empSummary?.usedDates ?? [];
    const targetDate = visibleUsedDates[idx];
    if (!targetDate) {
      return false;
    }
    // 日付フォーマットを統一して比較（ゼロ埋め）
    const normalizeDate = (d: string) => {
      const [y, m, day] = d.split("-");
      return `${y}-${m.padStart(2, "0")}-${day.padStart(2, "0")}`;
    };
    const normTargetDate = normalizeDate(targetDate);
    const targetUsage = leaveUsages.find(
      (u) =>
        u.employeeId === emp.employeeId &&
        normalizeDate(u.usedDate) === normTargetDate
    );
    if (!targetUsage) {
      alert("該当する有給消化履歴が見つかりません");
      return false;
    }
    try {
      // RESTful DELETE: id指定
      const { deleteLeaveUsage } = await import("./api/leaveUsageApi");
      await deleteLeaveUsage(
        targetUsage.id,
        auth?.token ? { Authorization: `Bearer ${auth.token}` } : undefined
      );
      await reloadAll();
      return true;
    } catch (e: any) {
      alert(e.message || "有給消化日の削除に失敗しました");
      return false;
    }
  };

  // --- 従業員追加 ---
  // ポイント: 入社日から初期パスワード自動生成、追加後はページ送り
  const handleAddEmployee = async (form: any) => {
    try {
      // 入社年月日からパスワード生成（例: 2023-05-01 → 20230501）
      const password = form.joinedAt.replace(/-/g, "");
      await apiPost(
        `${API_BASE}/api/employees`,
        {
          employee_id: form.employeeId,
          last_name: form.lastName,
          first_name: form.firstName,
          joined_at: form.joinedAt,
          password,
          role: "viewer", // 一般従業員はviewer固定
          mode: "add",
        },
        auth?.token ? { Authorization: `Bearer ${auth.token}` } : undefined
      );
      const employeesList = await reloadAll();
      const ITEMS_PER_PAGE = 15;
      setCurrentPage(Math.ceil(employeesList.length / ITEMS_PER_PAGE));
      setActiveEmployeeId(null);
      setActiveModal(null);
    } catch (e: any) {
      alert(e.message || "従業員追加に失敗しました");
    }
  };

  // --- 従業員編集 ---
  // ポイント: 編集後は一覧を再取得
  const handleSaveEmployee = async (form: any) => {
    try {
      await editEmployee(
        {
          id: form.id,
          employeeId: form.employeeId,
          lastName: form.lastName,
          firstName: form.firstName,
          joinedAt: form.joinedAt,
        },
        auth?.token ? { Authorization: `Bearer ${auth.token}` } : undefined
      );
      await reloadAll();
      setActiveEmployeeId(null);
      setActiveModal(null);
    } catch (e: any) {
      alert(e.message || "従業員編集に失敗しました");
    }
  };

  // ===============================
  // ▼サマリー・有給日・付与詳細のgetter関数
  // ===============================

  // --- サマリー取得 ---
  // ポイント: activeEmployeeIdから該当サマリーを返す
  const getSummary = (
    activeEmployeeId: string | null,
    employees: Employee[],
    summaries: EmployeeSummary[],
    emptySummary: any
  ) => {
    const emp = employees.find((e) => e.employeeId === activeEmployeeId);
    const s = summaries.find((s) => s.employeeId === (emp?.employeeId ?? null));
    return s || emptySummary;
  };

  // --- 有給取得日リスト取得 ---
  const getUsedDates = (
    activeEmployeeId: string | null,
    summaries: EmployeeSummary[]
  ) => {
    const empSummary = summaries.find((s) => s.employeeId === activeEmployeeId);
    return empSummary?.usedDates ?? [];
  };

  // --- 付与詳細リスト取得 ---
  const getGrantDetails = (
    activeEmployeeId: string | null,
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

  // ===============================
  // ▼認証状態の永続化
  // ===============================
  // ポイント: authが変化したらセッションストレージに保存
  useEffect(() => {
    if (auth) {
      sessionStorage.setItem("auth", JSON.stringify(auth));
    } else {
      sessionStorage.removeItem("auth");
    }
  }, [auth]);

  // ===============================
  // ▼画面描画（JSX）
  // ===============================
  // ポイント: ログイン状態で分岐し、主要なUI部品に必要なpropsのみ渡す
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
                if (auth?.role !== "viewer") {
                  setActiveEmployeeId(null);
                  setActiveModal("add");
                }
              }}
              size="md"
              px={6}
              boxShadow="md"
              disabled={auth?.role === "viewer"}
              style={{
                cursor: auth?.role === "viewer" ? "not-allowed" : undefined,
                opacity: auth?.role === "viewer" ? 0.5 : 1,
              }}
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
          isReadOnly={auth?.role === "viewer"}
        />
      </Box>
    </Box>
  );
}

export default App;
