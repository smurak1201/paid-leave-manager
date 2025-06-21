import { useState } from "react";
import {
  Box,
  Heading,
  Button,
  Flex,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import type { Employee } from "./components/employee/types";
import { EmployeeTable } from "./components/employee/EmployeeTable";
import { EmployeeModal } from "./components/employee/EmployeeModal";
import { Icons } from "./components/employee/icons";
import { GuideModal } from "./components/ui/GuideModal";
import { LeaveDatesModal } from "./components/employee/LeaveDatesModal";

const initialEmployees: Employee[] = [
  {
    id: "001",
    lastName: "山田",
    firstName: "太郎",
    joinedAt: "2023-04-01",
    total: 20,
    used: 5,
    leaveDates: [
      "2025-04-01",
      "2025-04-15",
      "2025-05-10",
      "2025-06-01",
      "2025-06-15",
    ],
  },
  {
    id: "002",
    lastName: "佐藤",
    firstName: "花子",
    joinedAt: "2024-04-01",
    total: 15,
    used: 3,
    leaveDates: ["2025-03-20", "2025-04-10", "2025-06-05"],
  },
];

// 勤続年数（月単位）から付与日数を返す
function calcLeaveDays(joinedAt: string, now: Date = new Date()): number {
  if (!joinedAt.match(/^\d{4}-\d{2}-\d{2}$/)) return 10;
  const join = new Date(joinedAt);
  const diff =
    (now.getFullYear() - join.getFullYear()) * 12 +
    (now.getMonth() - join.getMonth());
  if (diff < 6) return 0;
  if (diff < 18) return 10;
  if (diff < 30) return 11;
  if (diff < 42) return 12;
  if (diff < 54) return 14;
  if (diff < 66) return 16;
  if (diff < 78) return 18;
  return 20;
}

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
  const [viewDates, setViewDates] = useState<string[] | null>(null);
  const [viewName, setViewName] = useState<string>("");
  const [editDateIdx, setEditDateIdx] = useState<number | null>(null);
  const [dateInput, setDateInput] = useState<string>("");
  const [guideOpen, setGuideOpen] = useState(false);
  const guideDisclosure = useDisclosure();

  // 入社年月日変更時にtotalを自動計算
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      let next = {
        ...prev,
        [name]: name === "total" || name === "used" ? Number(value) : value,
      };
      if (name === "joinedAt") {
        next.total = calcLeaveDays(value);
      }
      return next;
    });
  };

  const handleAdd = () => {
    if (!form.id || !form.lastName || !form.firstName || !form.joinedAt) return;
    const autoTotal = calcLeaveDays(form.joinedAt);
    const newEmp = { ...form, total: autoTotal };
    if (editId) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === editId ? { ...newEmp } : emp))
      );
    } else {
      setEmployees([...employees, { ...newEmp }]);
    }
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
    setForm(emp);
    setEditId(emp.id);
    onOpen();
  };

  const handleDelete = (emp: Employee) => {
    setEmployees((prev) => prev.filter((e) => e.id !== emp.id));
  };

  const handleView = (emp: Employee) => {
    setViewDates(emp.leaveDates);
    setViewName(`${emp.lastName} ${emp.firstName}`);
  };

  const handleAddDate = () => {
    if (!viewDates || !dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) return;
    setViewDates([...viewDates, dateInput]);
    setDateInput("");
    // employees側も更新
    setEmployees((prev) =>
      prev.map((emp) =>
        `${emp.lastName} ${emp.firstName}` === viewName
          ? { ...emp, leaveDates: [...emp.leaveDates, dateInput] }
          : emp
      )
    );
  };

  const handleEditDate = (idx: number) => {
    setEditDateIdx(idx);
    setDateInput(viewDates ? viewDates[idx] : "");
  };

  const handleSaveDate = () => {
    if (
      !viewDates ||
      editDateIdx === null ||
      !dateInput.match(/^\d{4}-\d{2}-\d{2}$/)
    )
      return;
    const newDates = viewDates.map((d, i) =>
      i === editDateIdx ? dateInput : d
    );
    setViewDates(newDates);
    setEditDateIdx(null);
    setDateInput("");
    setEmployees((prev) =>
      prev.map((emp) =>
        `${emp.lastName} ${emp.firstName}` === viewName
          ? { ...emp, leaveDates: newDates }
          : emp
      )
    );
  };

  const handleDeleteDate = (idx: number) => {
    if (!viewDates) return;
    const newDates = viewDates.filter((_, i) => i !== idx);
    setViewDates(newDates);
    setEditDateIdx(null);
    setDateInput("");
    setEmployees((prev) =>
      prev.map((emp) =>
        `${emp.lastName} ${emp.firstName}` === viewName
          ? { ...emp, leaveDates: newDates }
          : emp
      )
    );
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
          isOpen={guideDisclosure.open}
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
          onClose();
        }}
        form={form}
        onChange={handleChange}
        onAdd={handleAdd}
      />
      <LeaveDatesModal
        isOpen={!!viewDates}
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
      />
    </Box>
  );
}

export default App;
