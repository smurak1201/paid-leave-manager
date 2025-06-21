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
import { X } from "lucide-react";

const initialEmployees: Employee[] = [
  {
    id: "001",
    lastName: "山田",
    firstName: "太郎",
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
    total: 15,
    used: 3,
    leaveDates: ["2025-03-20", "2025-04-10", "2025-06-05"],
  },
];

function App() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const [form, setForm] = useState<Employee>({
    id: "",
    lastName: "",
    firstName: "",
    total: 20,
    used: 0,
    leaveDates: [],
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [viewDates, setViewDates] = useState<string[] | null>(null);
  const [viewName, setViewName] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "total" || name === "used" ? Number(value) : value,
    }));
  };

  const handleAdd = () => {
    if (!form.id || !form.lastName || !form.firstName) return;
    if (editId) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === editId ? { ...form } : emp))
      );
    } else {
      setEmployees([...employees, { ...form }]);
    }
    setForm({
      id: "",
      lastName: "",
      firstName: "",
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
        <Flex mb={6} justify="flex-end">
          <Button
            colorScheme="teal"
            onClick={() => {
              setForm({
                id: "",
                lastName: "",
                firstName: "",
                total: 20,
                used: 0,
                leaveDates: [],
              });
              setEditId(null);
              onOpen();
            }}
            size="md"
            px={8}
            boxShadow="md"
          >
            従業員追加
          </Button>
        </Flex>
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
      {/* 有給取得日確認モーダル */}
      {viewDates && (
        <Box
          position="fixed"
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          zIndex={2000}
          bg="blackAlpha.400"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            bg="white"
            borderRadius="lg"
            boxShadow="lg"
            p={6}
            minW="320px"
            maxW="90vw"
            position="relative"
          >
            <Button
              position="absolute"
              top={2}
              right={2}
              size="sm"
              variant="ghost"
              colorScheme="teal"
              onClick={() => setViewDates(null)}
              p={2}
              minW={"auto"}
            >
              <X size={18} />
            </Button>
            <Heading
              as="h3"
              size="md"
              mb={4}
              color="teal.700"
              textAlign="center"
            >
              {viewName} さんの有給取得日
            </Heading>
            {viewDates.length === 0 ? (
              <Text color="gray.500" textAlign="center">
                取得履歴なし
              </Text>
            ) : (
              <Box as="ul" pl={0} m={0}>
                {viewDates.map((date, i) => (
                  <Box
                    as="li"
                    key={date}
                    fontSize="md"
                    color="teal.700"
                    py={2}
                    px={4}
                    borderBottom={
                      i !== viewDates.length - 1 ? "1px solid" : undefined
                    }
                    borderColor="teal.50"
                    borderRadius="md"
                    mb={1}
                    listStyleType="none"
                    bg={i % 2 === 0 ? "teal.50" : "white"}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Text fontWeight="bold" minW="2em">
                      {i + 1}.
                    </Text>
                    <Text>{date}</Text>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default App;
