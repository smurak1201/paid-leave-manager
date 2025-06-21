import { useState } from "react";
import { Box, Heading, Button, Flex, useDisclosure } from "@chakra-ui/react";
import type { Employee } from "./components/employee/types";
import { EmployeeTable } from "./components/employee/EmployeeTable";
import { EmployeeModal } from "./components/employee/EmployeeModal";

const initialEmployees: Employee[] = [
  { id: "001", lastName: "山田", firstName: "太郎", total: 20, used: 5 },
  { id: "002", lastName: "佐藤", firstName: "花子", total: 15, used: 3 },
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
  });
  const [editId, setEditId] = useState<string | null>(null);

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
    setForm({ id: "", lastName: "", firstName: "", total: 20, used: 0 });
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
    </Box>
  );
}

export default App;
