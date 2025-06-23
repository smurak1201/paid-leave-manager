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
  const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);
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
      employeeId: emp.employee_id, // ← employee_idに変更
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
      employeeId: u.employee_id,
      usedDate: u.used_date,
    }));
  };
  const fetchSummaries = async (emps: Employee[]) => {
    return Promise.all(
      emps.map(async (emp) => {
        try {
          const data = await apiGet<any>(
            `http://localhost/paid_leave_manager/leave_summary.php?employee_id=${emp.employeeId}` // ← employee_idに変更
          );
          return {
            employeeId: emp.employeeId, // ← employeeIdで持つ
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
    employeeId: string;
    grantThisYear: number;
    carryOver: number;
    used: number;
    remain: number;
    usedDates: string[]; // 追加
  };
  const [summaries, setSummaries] = useState<EmployeeSummary[]>([]);
  useEffect(() => {
    if (employees.length === 0) return;
    fetchSummaries(employees).then(setSummaries);
  }, [employees]);

  // --- UIイベントハンドラ ---
  // テーブル「確認」ボタン
  const handleView = (employeeId: string) => {
    setActiveEmployeeId(employeeId);
    setActiveModal("leaveDates");
    setEditDateIdx(null);
    setDateInput("");
  };
  // テーブル「編集」ボタン
  const handleEdit = (employeeId: string) => {
    setActiveEmployeeId(employeeId);
    setActiveModal("edit");
  };
  // 「従業員追加」ボタン
  const handleAdd = () => {
    setActiveEmployeeId(null);
    setActiveModal("add");
  };
  // モーダルを閉じる
  const handleCloseModal = () => {
    setActiveModal(null);
    setActiveEmployeeId(null);
    setEditDateIdx(null);
    setDateInput("");
  };

  // --- 有給サマリー・詳細のAPI連携 ---
  useEffect(() => {
    if (employees.length === 0) return;
    fetchSummaries(employees).then(setSummaries);
  }, [employees]);

  // --- 有給取得日編集用の状態・ロジック ---
  const [editDateIdx, setEditDateIdx] = useState<number | null>(null);
  const [dateInput, setDateInput] = useState("");

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
            onEdit={handleEdit}
            onDelete={async (employeeId) => {
              try {
                // 先に有給取得日を全て削除
                const emp = employees.find((e) => e.employeeId === employeeId);
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
                  {
                    employee_id: employeeId,
                    mode: "delete",
                  }
                );
                const data = await fetchEmployees();
                setEmployees(data);
                setLeaveUsages(await fetchLeaveUsages()); // 取得日も再取得
                setSummaries(await fetchSummaries(data)); // サマリーも再取得
              } catch (e: any) {
                alert(e.message || "従業員削除に失敗しました");
              }
            }}
            onView={handleView}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <EmployeeModal
          isOpen={activeModal === "add" || activeModal === "edit"}
          onClose={handleCloseModal}
          employee={
            activeModal === "add"
              ? null
              : employees.find((e) => e.employeeId === activeEmployeeId) ?? null
          }
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
              const data = await fetchEmployees();
              setEmployees(data);
              const ITEMS_PER_PAGE = 15;
              const newTotal = data.length;
              setCurrentPage(Math.ceil(newTotal / ITEMS_PER_PAGE));
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
              const data = await fetchEmployees();
              setEmployees(data);
              setActiveEmployeeId(null);
              setActiveModal(null);
            } catch (e: any) {
              alert(e.message || "従業員編集に失敗しました");
            }
          }}
        />
        <LeaveDatesModal
          isOpen={activeModal === "leaveDates"}
          onClose={handleCloseModal}
          employeeId={
            activeEmployeeId !== null ? String(activeEmployeeId) : null
          }
          leaveUsages={leaveUsages}
          onAddDate={async (date) => {
            const emp =
              activeEmployeeId !== null
                ? employees.find(
                    (e) => e.employeeId === String(activeEmployeeId)
                  )
                : null;
            if (!emp) return;
            try {
              await apiPost(
                "http://localhost/paid_leave_manager/leave_usage_add.php",
                {
                  employee_id: emp.employeeId,
                  used_date: date,
                }
              );
              setLeaveUsages(await fetchLeaveUsages());
              setSummaries(await fetchSummaries(employees));
              setDateInput("");
            } catch (e: any) {
              alert(e.message || "有給消化日の追加に失敗しました");
            }
          }}
          onDeleteDate={async (idx) => {
            const emp =
              activeEmployeeId !== null
                ? employees.find(
                    (e) => e.employeeId === String(activeEmployeeId)
                  )
                : null;
            if (!emp) return false;
            // 画面に表示しているusedDatesから削除対象日付を特定
            const id = emp.employeeId;
            const summary = summaries.find((s) => s.employeeId === id);
            const usedDates =
              summary && summary.usedDates ? summary.usedDates : [];
            const targetDate = usedDates[idx];
            if (!targetDate) return false;
            // leaveUsagesから該当日付・従業員IDのレコードを探す
            const target = leaveUsages.find(
              (u) =>
                u.employeeId === emp.employeeId && u.usedDate === targetDate
            );
            if (!target) return false;
            try {
              await apiPost(
                "http://localhost/paid_leave_manager/leave_usage_delete.php",
                { id: target.id }
              );
              setLeaveUsages(await fetchLeaveUsages());
              setSummaries(await fetchSummaries(employees));
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
            const id =
              activeEmployeeId !== null ? String(activeEmployeeId) : null;
            const s = summaries.find((s) => s.employeeId === id);
            return s || { grantThisYear: 0, carryOver: 0, used: 0, remain: 0 };
          })()}
          usedDates={(() => {
            const id =
              activeEmployeeId !== null ? String(activeEmployeeId) : null;
            const summary = summaries.find((s) => s.employeeId === id);
            return summary && summary.usedDates ? summary.usedDates : [];
          })()}
        />
      </Box>
    </Box>
  );
}

export default App;
