import { useState } from "react";
import { Box, Heading, Button, Flex, useDisclosure } from "@chakra-ui/react";
import type { Employee } from "./components/employee/types";
import { EmployeeTable } from "./components/employee/EmployeeTable";
import { EmployeeModal } from "./components/employee/EmployeeModal";
import { Icons } from "./components/employee/icons";
import { GuideModal } from "./components/ui/GuideModal";
import { LeaveDatesModal } from "./components/employee/LeaveDatesModal";
import { calcLeaveDays, calcStrictRemain } from "./components/employee/utils";

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

// App関数以下はそのまま
function App() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const [form, setForm] = useState<Employee>({
    id: "",
    lastName: "",
    firstName: "",
    joinedAt: "",
    total: 20,
    used: 0,
    leaveDates: [],
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [viewDates, setViewDates] = useState<string[] | null>(null); // viewDatesの初期値はnull
  const [viewName, setViewName] = useState<string>("");
  const [editDateIdx, setEditDateIdx] = useState<number | null>(null);
  const [dateInput, setDateInput] = useState<string>("");
  const [idError, setIdError] = useState<string>("");
  const guideDisclosure = useDisclosure();

  const isFutureDate = (date: string) => {
    if (!date) return false;
    const today = new Date();
    const d = new Date(date);
    return d > today;
  };

  // 入社年月日変更時にtotalを自動計算
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "id") {
      setForm((prev) => ({ ...prev, id: value }));
      if (value && !/^[0-9]*$/.test(value)) {
        setIdError("従業員コードは半角数字のみ入力できます");
      } else if (
        value &&
        employees.some(
          (emp) => emp.id === value && (editId === null || emp.id !== editId)
        )
      ) {
        setIdError("従業員コードが重複しています");
      } else if (!value) {
        setIdError("従業員コードは必須です");
      } else {
        setIdError("");
      }
      return;
    }
    setForm((prev) => {
      let next = {
        ...prev,
        [name]: name === "total" || name === "used" ? Number(value) : value,
      };
      if (name === "joinedAt") {
        next.total = calcLeaveDays(value);
        // setViewDates([]) → setViewDates(null) に修正
        setViewDates(null);
      }
      return next;
    });
  };

  const handleAdd = () => {
    if (
      !form.id ||
      !form.lastName ||
      !form.firstName ||
      !form.joinedAt ||
      idError ||
      isFutureDate(form.joinedAt)
    ) {
      setIdError("全ての項目を正しく入力してください（入社日は未来日不可）");
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
    setEditId(null);
    onClose();
  };

  const handleSave = () => {
    if (
      !form.id ||
      !form.lastName ||
      !form.firstName ||
      !form.joinedAt ||
      idError ||
      isFutureDate(form.joinedAt)
    ) {
      setIdError("全ての項目を正しく入力してください（入社日は未来日不可）");
      return;
    }
    const autoTotal = calcLeaveDays(form.joinedAt);
    const newEmp = { ...form, total: autoTotal };
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === editId ? { ...newEmp } : emp))
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
    setEditId(null);
    onClose();
  };

  const handleEdit = (emp: Employee) => {
    setViewDates(null); // 他モーダルを閉じる
    setEditId(emp.id);
    setForm(emp);
    onOpen();
  };

  const handleDelete = (emp: Employee) => {
    setEmployees((prev) => prev.filter((e) => e.id !== emp.id));
  };

  const handleView = (emp: Employee) => {
    onClose(); // 編集・追加モーダルを閉じる
    setEditId(null);
    setForm({
      id: "",
      lastName: "",
      firstName: "",
      joinedAt: "",
      total: 20,
      used: 0,
      leaveDates: [],
    });
    setViewDates(emp.leaveDates);
    setViewName(`${emp.lastName} ${emp.firstName}`);
  };

  const handleAddDate = () => {
    if (
      !viewDates ||
      !dateInput.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) ||
      remain === 0 ||
      viewDates.includes(dateInput) ||
      (targetEmp && dateInput < targetEmp.joinedAt) ||
      isFutureDate(dateInput)
    )
      return;
    setViewDates([...viewDates, dateInput]);
    setDateInput("");
  };

  const handleEditDate = (idx: number) => {
    setEditDateIdx(idx);
    setDateInput(viewDates ? viewDates[idx] : "");
  };

  const handleSaveDate = () => {
    if (
      !viewDates ||
      editDateIdx === null ||
      !dateInput.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) ||
      remain === 0 ||
      viewDates.includes(dateInput) ||
      (targetEmp && dateInput < targetEmp.joinedAt) ||
      isFutureDate(dateInput)
    )
      return;
    const newDates = viewDates.map((d, i) =>
      i === editDateIdx ? dateInput : d
    );
    setViewDates(newDates);
    setEditDateIdx(null);
    setDateInput("");
  };

  const handleDeleteDate = (idx: number) => {
    if (!viewDates) return;
    const newDates = viewDates.filter((_, i) => i !== idx);
    setViewDates(newDates);
    setEditDateIdx(null);
    setDateInput("");
  };

  // 残日数計算（viewDatesがnullなら0、入社日より前は除外して計算）
  const targetEmp = employees.find(
    (emp) => `${emp.lastName} ${emp.firstName}` === viewName
  );
  const validDates =
    viewDates && targetEmp
      ? viewDates.filter((d) => d >= targetEmp.joinedAt)
      : [];
  const remain = targetEmp ? calcStrictRemain(targetEmp.grants, validDates) : 0;

  // 有給取得日モーダルの「保存」ボタンでのみemployeesを更新
  const handleSaveLeaveDates = () => {
    if (!viewDates || remain === 0) return;
    const targetEmp = employees.find(
      (emp) => `${emp.lastName} ${emp.firstName}` === viewName
    );
    if (!targetEmp) return;
    const validDates = viewDates.filter((d) => d >= targetEmp.joinedAt);
    const newRemain = calcStrictRemain(targetEmp.grants, validDates);
    const hasInvalidDate = viewDates.some((d) => d < targetEmp.joinedAt);
    const hasDuplicate = new Set(viewDates).size !== viewDates.length;
    const hasFuture = viewDates.some(isFutureDate);
    if (hasInvalidDate) {
      alert("入社日より前の日付は登録できません。");
      return;
    }
    if (hasDuplicate) {
      alert("有給取得日が重複しています。");
      return;
    }
    if (hasFuture) {
      alert("未来日を有給取得日として登録できません。");
      return;
    }
    if (newRemain < 0) {
      alert("残日数を超える有給取得日は登録できません。");
      return;
    }
    setEmployees((prev) =>
      prev.map((emp) =>
        `${emp.lastName} ${emp.firstName}` === viewName
          ? { ...emp, leaveDates: viewDates }
          : emp
      )
    );
    setViewDates(null);
    setEditDateIdx(null);
    setDateInput("");
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
            onClick={() => {
              setViewDates(null); // 他モーダルを閉じる
              setEditId(null);
              setForm({
                id: "",
                lastName: "",
                firstName: "",
                joinedAt: "",
                total: 20,
                used: 0,
                leaveDates: [],
              });
              onOpen();
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
        <EmployeeTable
          employees={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      </Box>
      <EmployeeModal
        isOpen={isOpen}
        onClose={() => {
          setEditId(null);
          setForm({
            id: "",
            lastName: "",
            firstName: "",
            joinedAt: "",
            total: 20,
            used: 0,
            leaveDates: [],
          });
          setIdError("");
          onClose();
        }}
        form={form}
        onChange={handleChange}
        onAdd={handleAdd}
        onSave={handleSave}
        idError={idError}
        editId={editId}
      />
      <LeaveDatesModal
        isOpen={viewDates !== null}
        onClose={() => {
          setViewDates(null);
          setEditDateIdx(null);
          setDateInput("");
        }}
        viewName={viewName}
        viewDates={viewDates || []}
        editDateIdx={editDateIdx}
        dateInput={dateInput}
        onDateInputChange={setDateInput}
        onEditDate={handleEditDate}
        onSaveDate={handleSaveDate}
        onDeleteDate={handleDeleteDate}
        onAddDate={handleAddDate}
        setEditDateIdx={setEditDateIdx}
        onSaveLeaveDates={handleSaveLeaveDates}
        remain={remain}
      />
    </Box>
  );
}

export default App;
