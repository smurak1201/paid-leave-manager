import { useState } from "react";
import {
  Box,
  Heading,
  Button,
  Flex,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import type { Employee, LeaveGrant } from "./components/employee/types";
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
    joinedAt: "2021-04-01",
    grants: [
      { grantDate: "2022-04-01", days: 12, usedDates: ["2022-05-10"] }, // 2年以上前→時効消滅
      {
        grantDate: "2023-04-01",
        days: 14,
        usedDates: ["2023-06-15", "2024-05-20"],
      }, // 有効
      { grantDate: "2024-04-01", days: 16, usedDates: ["2024-06-10"] }, // 有効
    ],
    total: 30, // grants合計
    used: 4, // leaveDates.length
    leaveDates: [
      "2022-05-10", // 2022年付与分から消化（時効消滅）
      "2023-06-15", // 2023年付与分から消化
      "2024-05-20", // 2023年付与分から消化
      "2024-06-10", // 2024年付与分から消化
    ],
    carryOver: 0,
  },
  {
    id: "002",
    lastName: "佐藤",
    firstName: "花子",
    joinedAt: "2022-04-01",
    grants: [
      {
        grantDate: "2023-04-01",
        days: 14,
        usedDates: ["2023-07-01", "2024-04-10"],
      }, // 有効
      { grantDate: "2024-04-01", days: 16, usedDates: ["2025-04-02"] }, // 有効
    ],
    total: 30,
    used: 3,
    leaveDates: [
      "2023-07-01", // 2023年付与分から消化
      "2024-04-10", // 2023年付与分から消化
      "2025-04-02", // 2024年付与分から消化
    ],
    carryOver: 0,
  },
  {
    id: "003",
    lastName: "田中",
    firstName: "一郎",
    joinedAt: "2023-04-01",
    grants: [
      { grantDate: "2024-04-01", days: 16, usedDates: ["2024-05-01"] }, // 有効
    ],
    total: 16,
    used: 1,
    leaveDates: [
      "2024-05-01", // 2024年付与分から消化
    ],
    carryOver: 0,
  },
  {
    id: "004",
    lastName: "鈴木",
    firstName: "美咲",
    joinedAt: "2021-04-01",
    grants: [
      {
        grantDate: "2022-04-01",
        days: 12,
        usedDates: ["2022-06-01", "2022-07-01"],
      }, // 2年以上前→時効消滅
      { grantDate: "2023-04-01", days: 14, usedDates: ["2023-08-10"] }, // 有効
      { grantDate: "2024-04-01", days: 16, usedDates: [] }, // 有効
    ],
    total: 42, // grants合計
    used: 3, // leaveDates.length
    leaveDates: [
      "2022-06-01", // 2022年付与分から消化（時効消滅）
      "2022-07-01", // 2022年付与分から消化（時効消滅）
      "2023-08-10", // 2023年付与分から消化
    ],
    carryOver: 12, // 2023年4月時点で2022年分12-2=10日繰越、2024年4月時点で2023年分14-1=13日繰越
  },
];

// 勤続年数（月単位）から付与日数を返す
export function calcLeaveDays(
  joinedAt: string,
  now: Date = new Date()
): number {
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

// 付与履歴・消化履歴から有効な残日数を厳密に計算（2年時効・古い付与分から消化）
function calcStrictRemain(
  grants: LeaveGrant[] = [],
  leaveDates: string[] = [],
  now: Date = new Date()
): number {
  // 1. 2年以内の付与分のみ有効
  const validGrants = grants
    .filter((g) => {
      const grantDate = new Date(g.grantDate);
      const diff =
        (now.getFullYear() - grantDate.getFullYear()) * 12 +
        (now.getMonth() - grantDate.getMonth());
      return diff < 24; // 24か月未満
    })
    .sort(
      (a, b) =>
        new Date(a.grantDate).getTime() - new Date(b.grantDate).getTime()
    );

  // 2. 古い付与分から順に消化
  const usedDates = [...leaveDates].sort(); // 昇順（日付が古い順）
  let remainList = validGrants.map((g) => ({ days: g.days, used: 0 }));
  let usedIdx = 0;
  for (let i = 0; i < remainList.length && usedIdx < usedDates.length; ) {
    if (remainList[i].days - remainList[i].used > 0) {
      remainList[i].used++;
      usedIdx++;
    } else {
      i++;
    }
  }
  // 3. 残日数合計
  return remainList.reduce((sum, g) => sum + (g.days - g.used), 0);
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
