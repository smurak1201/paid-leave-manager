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
import type { LeaveUsage } from "./components/employee/types";

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
            `http://localhost/paid_leave_manager/leave_summary.php?employee_id=${emp.id}`
          );
          return {
            employeeId: emp.id,
            grantThisYear: data.grantThisYear ?? 0,
            carryOver: data.carryOver ?? 0,
            used: data.used ?? 0,
            remain: data.remain ?? 0,
          };
        } catch {
          return {
            employeeId: emp.id,
            grantThisYear: 0,
            carryOver: 0,
            used: 0,
            remain: 0,
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
    employeeId: number;
    grantThisYear: number;
    carryOver: number;
    used: number;
    remain: number;
  };
  const [summaries, setSummaries] = useState<EmployeeSummary[]>([]);
  useEffect(() => {
    if (employees.length === 0) return;
    fetchSummaries(employees).then(setSummaries);
  }, [employees]);

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
    setActiveEmployeeId(id);
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
            onDelete={async (id) => {
              try {
                await apiPost(
                  "http://localhost/paid_leave_manager/employees.php",
                  {
                    id,
                    mode: "delete",
                  }
                );
                const data = await fetchEmployees();
                setEmployees(data);
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
          employeeId={
            activeModal === "add"
              ? null
              : activeEmployeeId !== null
              ? employees.find((e) => e.id === activeEmployeeId)
                  ?.employeeCode ?? null
              : null
          }
          getEmployee={(code) => employees.find((e) => e.employeeCode === code)}
          onAdd={async (form) => {
            try {
              await apiPost(
                "http://localhost/paid_leave_manager/employees.php",
                {
                  id: form.id,
                  employee_code: form.employeeCode,
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
                  employee_code: form.employeeCode,
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
            activeEmployeeId !== null
              ? employees.find((e) => e.id === activeEmployeeId)
                  ?.employeeCode ?? null
              : null
          }
          leaveUsages={leaveUsages}
          onAddDate={async (date) => {
            const code =
              activeEmployeeId !== null
                ? employees.find((e) => e.id === activeEmployeeId)?.employeeCode
                : null;
            if (!code) return;
            try {
              await apiPost(
                "http://localhost/paid_leave_manager/leave_usage_add.php",
                {
                  employee_code: code,
                  used_date: date,
                }
              );
              setLeaveUsages(await fetchLeaveUsages());
              setDateInput("");
            } catch (e: any) {
              alert(e.message || "有給消化日の追加に失敗しました");
            }
          }}
          onDeleteDate={async (idx) => {
            const code =
              activeEmployeeId !== null
                ? employees.find((e) => e.id === activeEmployeeId)?.employeeCode
                : null;
            if (!code) return;
            const empUsages = leaveUsages.filter((u) => u.employeeId === code);
            if (!empUsages[idx]) return;
            const target = empUsages[idx];
            try {
              await apiPost(
                "http://localhost/paid_leave_manager/leave_usage_delete.php",
                { id: target.id }
              );
              setLeaveUsages(await fetchLeaveUsages());
            } catch (e: any) {
              alert(e.message || "有給消化日の削除に失敗しました");
            }
          }}
          editDateIdx={editDateIdx}
          setEditDateIdx={setEditDateIdx}
          dateInput={dateInput}
          setDateInput={setDateInput}
          currentPage={leaveDatesPage}
          onPageChange={setLeaveDatesPage}
          summary={(() => {
            const code =
              activeEmployeeId !== null
                ? employees.find((e) => e.id === activeEmployeeId)?.employeeCode
                : null;
            const s = summaries.find((s) => s.employeeId === code);
            return s || { grantThisYear: 0, carryOver: 0, used: 0, remain: 0 };
          })()}
          grantDetails={(() => {
            const code =
              activeEmployeeId !== null
                ? employees.find((e) => e.id === activeEmployeeId)?.employeeCode
                : null;
            if (!code) return [];
            const dates = leaveUsages
              .filter((u) => u.employeeId === code)
              .map((u) => u.usedDate)
              .sort();
            return [
              {
                grantDate: "",
                days: 0,
                used: dates.length,
                remain: 0,
                usedDates: dates,
              },
            ];
          })()}
        />
      </Box>
    </Box>
  );
}

export default App;
