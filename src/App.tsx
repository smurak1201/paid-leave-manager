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
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveUsages, setLeaveUsages] = useState<LeaveUsage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [leaveDatesPage, setLeaveDatesPage] = useState(1);
  const [activeModal, setActiveModal] = useState<
    null | "add" | "edit" | "leaveDates"
  >(null);
  const [activeEmployeeId, setActiveEmployeeId] = useState<number | null>(null);
  const guideDisclosure = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- データ取得・更新用関数 ---
  const fetchEmployees = async () => {
    const data = await apiGet<any[]>(
      "http://localhost/paid_leave_manager/employees.php"
    );
    return data.map((emp: any) => ({
      ...emp,
      employeeId: Number(emp.employee_id), // number型で持つ
      joinedAt: emp.joined_at,
      lastName: emp.last_name,
      firstName: emp.first_name,
    }));
  };
  const fetchLeaveUsages = async () => {
    const data = await apiGet<any[]>(
      "http://localhost/paid_leave_manager/leave_usages.php"
    );
    return data.map((u: any) => ({
      ...u,
      employeeId: Number(u.employee_id), // number型で持つ
      usedDate: u.used_date,
    }));
  };
  const fetchSummaries = async (emps: Employee[]) => {
    return Promise.all(
      emps.map(async (emp) => {
        try {
          const data = await apiGet<any>(
            `http://localhost/paid_leave_manager/leave_summary.php?employee_id=${emp.employeeId}`
          );
          return {
            employeeId: emp.employeeId,
            grantThisYear: data.grantThisYear ?? 0,
            carryOver: data.carryOver ?? 0,
            used: data.used ?? 0,
            remain: data.remain ?? 0,
            usedDates: data.usedDates ?? [],
          };
        } catch {
          return {
            employeeId: emp.employeeId,
            grantThisYear: 0,
            carryOver: 0,
            used: 0,
            remain: 0,
            usedDates: [],
          };
        }
      })
    );
  };

  // データ再取得をまとめて行う関数
  const reloadAll = async () => {
    const emps = await fetchEmployees();
    setEmployees(emps);
    setLeaveUsages(await fetchLeaveUsages());
    setSummaries(await fetchSummaries(emps));
    return emps;
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
  type EmployeeSummary = {
    employeeId: number;
    grantThisYear: number;
    carryOver: number;
    used: number;
    remain: number;
    usedDates: string[];
  };
  const [summaries, setSummaries] = useState<EmployeeSummary[]>([]);
  useEffect(() => {
    if (employees.length === 0) return;
    fetchSummaries(employees).then(setSummaries);
  }, [employees]);

  // --- UIイベントハンドラ ---
  // テーブル「確認」ボタン
  const handleView = (employeeId: number) => {
    setActiveEmployeeId(employeeId); // employeeIdは必ず従業員コード（employee_id）を渡す
    setActiveModal("leaveDates");
  };
  // テーブル「編集」ボタン
  const handleEdit = (employeeId: number) => {
    setActiveEmployeeId(employeeId); // employeeIdは必ず従業員コード（employee_id）を渡す
    setActiveModal("edit");
  };
  // 「従業員追加」ボタン
  const handleAdd = () => {
    setActiveEmployeeId(null);
    setActiveModal("add");
  };

  // --- 有給サマリー・詳細のAPI連携 ---
  useEffect(() => {
    if (employees.length === 0) return;
    fetchSummaries(employees).then(setSummaries);
  }, [employees]);

  // --- 有給取得日編集用の状態・ロジック ---
  const [editDateIdx, setEditDateIdx] = useState<number | null>(null);
  const [dateInput, setDateInput] = useState("");
  const [addDateError, setAddDateError] = useState("");

  // 従業員IDから従業員オブジェクトを取得
  const findEmployee = (id: number | null) =>
    employees.find((e) => e.employeeId === id) ?? null;

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
            onClick={handleAdd}
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
            summaries={summaries}
            onEdit={(employeeId) => handleEdit(employeeId)} // employeeIdは従業員コード
            onDelete={async (employeeId) => {
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
                await apiPost(
                  "http://localhost/paid_leave_manager/employees.php",
                  { employee_id: employeeId, mode: "delete" }
                );
                await reloadAll();
              } catch (e: any) {
                alert(e.message || "従業員削除に失敗しました");
              }
            }}
            onView={(employeeId) => handleView(employeeId)} // employeeIdは従業員コード
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
          onAdd={async (form) => {
            try {
              await apiPost(
                "http://localhost/paid_leave_manager/employees.php",
                {
                  employee_id: form.employeeId,
                  last_name: form.lastName,
                  first_name: form.firstName,
                  joined_at: form.joinedAt,
                  mode: "add",
                }
              );
              const emps = await reloadAll();
              const ITEMS_PER_PAGE = 15;
              setCurrentPage(Math.ceil(emps.length / ITEMS_PER_PAGE));
              setActiveEmployeeId(null);
              setActiveModal(null);
            } catch (e: any) {
              alert(e.message || "従業員追加に失敗しました");
            }
          }}
          onSave={async (form) => {
            try {
              await apiPost(
                "http://localhost/paid_leave_manager/employees.php",
                {
                  id: form.id,
                  employee_id: form.employeeId,
                  last_name: form.lastName,
                  first_name: form.firstName,
                  joined_at: form.joinedAt,
                  mode: "edit",
                }
              );
              await reloadAll();
              setActiveEmployeeId(null);
              setActiveModal(null);
            } catch (e: any) {
              alert(e.message || "従業員編集に失敗しました");
            }
          }}
          onDelete={async (employeeId) => {
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
                    { id: usage.id }
                  );
                }
              }
              // 従業員本体を削除
              await apiPost(
                "http://localhost/paid_leave_manager/employees.php",
                { employee_id: employeeId, mode: "delete" }
              );
              await reloadAll();
              setActiveEmployeeId(null);
              setActiveModal(null);
            } catch (e: any) {
              alert(e.message || "従業員削除に失敗しました");
            }
          }}
        />
        <LeaveDatesModal
          key={activeEmployeeId ?? "none"}
          isOpen={activeModal === "leaveDates"}
          onClose={() => setActiveModal(null)}
          employeeId={activeEmployeeId} // ここも従業員コード
          leaveUsages={leaveUsages}
          onAddDate={async (date) => {
            if (activeEmployeeId == null) return;
            setAddDateError("");
            try {
              await apiPost(
                "http://localhost/paid_leave_manager/leave_usage_add.php",
                {
                  employee_id: Number(activeEmployeeId), // int型で送信
                  used_date: date,
                }
              );
              await reloadAll();
              setDateInput("");
            } catch (e: any) {
              setAddDateError(e.message || "有給消化日の追加に失敗しました");
            }
          }}
          onDeleteDate={async (idx) => {
            const emp = findEmployee(activeEmployeeId);
            if (!emp) return false;
            // leaveUsagesから該当従業員のusedDate配列を取得
            const usedDates = leaveUsages
              .filter((u) => u.employeeId === emp.employeeId)
              .map((u) => u.usedDate);
            const targetDate = usedDates[idx];
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
          }}
          editDateIdx={editDateIdx}
          setEditDateIdx={setEditDateIdx}
          dateInput={dateInput}
          setDateInput={setDateInput}
          currentPage={leaveDatesPage}
          onPageChange={setLeaveDatesPage}
          summary={(() => {
            const emp = findEmployee(activeEmployeeId);
            const s = summaries.find(
              (s) => s.employeeId === (emp?.employeeId ?? null)
            );
            return s || emptySummary;
          })()}
          usedDates={leaveUsages
            .filter((u) => u.employeeId === activeEmployeeId)
            .map((u) => u.usedDate)}
          grantDetails={undefined}
          addDateError={addDateError}
        />
      </Box>
    </Box>
  );
}

export default App;
