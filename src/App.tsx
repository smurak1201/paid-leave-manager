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
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [activeModal, setActiveModal] = useState<
    null | "add" | "edit" | "leaveDates"
  >(null);
  const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);
  const guideDisclosure = useDisclosure();

  // 最新の従業員データ
  const currentEmployee = activeEmployeeId
    ? employees.find((e) => e.id === activeEmployeeId) || null
    : null;

  // useEmployeeFormでフォーム状態・バリデーションを管理
  const { form, setForm, idError, setIdError, handleChange } = useEmployeeForm(
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

  // useLeaveDatesで有給日付編集ロジックを管理
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

  // テーブル操作
  const handleView = (emp: Employee) => {
    setActiveEmployeeId(emp.id);
    setActiveModal("leaveDates");
    setEditDateIdx(null);
    setDateInput("");
  };
  const handleEdit = (emp: Employee) => {
    setForm(emp);
    setActiveEmployeeId(emp.id);
    setActiveModal("edit");
    setIdError("");
  };
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
  const handleCloseModal = () => {
    setActiveModal(null);
    setActiveEmployeeId(null);
    setEditDateIdx(null);
    setDateInput("");
    setIdError("");
  };

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
        <EmployeeTable
          employees={employees}
          onEdit={handleEdit}
          onDelete={(emp) =>
            setEmployees((prev) => prev.filter((e) => e.id !== emp.id))
          }
          onView={handleView}
        />
        <EmployeeModal
          isOpen={activeModal === "add" || activeModal === "edit"}
          onClose={handleCloseModal}
          form={form}
          onChange={handleChange}
          onAdd={() => {
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
          onSave={() => {
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
        <LeaveDatesModal
          isOpen={activeModal === "leaveDates"}
          onClose={handleCloseModal}
          employeeId={activeEmployeeId}
          employees={employees}
          editDateIdx={editDateIdx}
          dateInput={dateInput}
          onChangeDateInput={setDateInput}
          onAddDate={(date) => {
            if (!currentEmployee) return;
            handleAddDate(date, (dates) =>
              setEmployees((prev) =>
                prev.map((emp) =>
                  emp.id === currentEmployee.id
                    ? { ...emp, leaveDates: dates }
                    : emp
                )
              )
            );
          }}
          onEditDate={handleEditDate}
          onSaveDate={() => {
            if (!currentEmployee) return;
            handleSaveDate((dates) =>
              setEmployees((prev) =>
                prev.map((emp) =>
                  emp.id === currentEmployee.id
                    ? { ...emp, leaveDates: dates }
                    : emp
                )
              )
            );
          }}
          onDeleteDate={(idx) => {
            if (!currentEmployee) return;
            handleDeleteDate(idx, (dates) =>
              setEmployees((prev) =>
                prev.map((emp) =>
                  emp.id === currentEmployee.id
                    ? { ...emp, leaveDates: dates }
                    : emp
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
