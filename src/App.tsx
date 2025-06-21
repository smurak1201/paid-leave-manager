import { useState } from "react";
import { Box, Heading, Button, Input, Flex } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/table";

interface Employee {
  id: number;
  name: string;
  total: number;
  used: number;
}

const initialEmployees: Employee[] = [
  { id: 1, name: "山田 太郎", total: 20, used: 5 },
  { id: 2, name: "佐藤 花子", total: 15, used: 3 },
];

function App() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [newName, setNewName] = useState("");
  const [newTotal, setNewTotal] = useState(20);

  const addEmployee = () => {
    if (!newName) return;
    setEmployees([
      ...employees,
      { id: Date.now(), name: newName, total: Number(newTotal), used: 0 },
    ]);
    setNewName("");
    setNewTotal(20);
  };

  return (
    <Box maxW="700px" mx="auto" mt={10} p={5}>
      <Heading mb={6}>有給休暇管理</Heading>
      <Flex mb={4} gap={2}>
        <Input
          placeholder="社員名"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Input
          type="number"
          min={1}
          value={newTotal}
          onChange={(e) => setNewTotal(Number(e.target.value))}
          width="120px"
        />
        <Button colorScheme="teal" onClick={addEmployee}>
          追加
        </Button>
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>社員名</Th>
            <Th isNumeric>付与日数</Th>
            <Th isNumeric>取得日数</Th>
            <Th isNumeric>残日数</Th>
          </Tr>
        </Thead>
        <Tbody>
          {employees.map((emp) => (
            <Tr key={emp.id}>
              <Td>{emp.name}</Td>
              <Td isNumeric>{emp.total}</Td>
              <Td isNumeric>{emp.used}</Td>
              <Td isNumeric>{emp.total - emp.used}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default App;
