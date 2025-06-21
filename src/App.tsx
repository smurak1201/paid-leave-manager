import { useState } from "react";
import {
  Box,
  Heading,
  Button,
  Input,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/table";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/modal";
import { FormControl, FormLabel } from "@chakra-ui/form-control";

interface Employee {
  id: string;
  lastName: string;
  firstName: string;
  total: number;
  used: number;
}

const initialEmployees: Employee[] = [
  { id: "001", lastName: "山田", firstName: "太郎", total: 20, used: 5 },
  { id: "002", lastName: "佐藤", firstName: "花子", total: 15, used: 3 },
];

function App() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const [form, setForm] = useState({
    id: "",
    lastName: "",
    firstName: "",
    total: 20,
    used: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "total" || name === "used" ? Number(value) : value,
    }));
  };

  const handleAdd = () => {
    if (!form.id || !form.lastName || !form.firstName) return;
    setEmployees([...employees, { ...form }]);
    setForm({ id: "", lastName: "", firstName: "", total: 20, used: 0 });
    onClose();
  };

  return (
    <Box maxW="700px" mx="auto" mt={10} p={5}>
      <Heading mb={6}>有給休暇管理</Heading>
      <Flex mb={4} gap={2}>
        <Button colorScheme="teal" onClick={onOpen}>
          追加
        </Button>
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>従業員コード</Th>
            <Th>姓</Th>
            <Th>名</Th>
            <Th isNumeric>付与日数</Th>
            <Th isNumeric>消化日数</Th>
            <Th isNumeric>残日数</Th>
          </Tr>
        </Thead>
        <Tbody>
          {employees.map((emp) => (
            <Tr key={emp.id}>
              <Td>{emp.id}</Td>
              <Td>{emp.lastName}</Td>
              <Td>{emp.firstName}</Td>
              <Td isNumeric>{emp.total}</Td>
              <Td isNumeric>{emp.used}</Td>
              <Td isNumeric>{emp.total - emp.used}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>従業員追加</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={2} isRequired>
              <FormLabel>従業員コード</FormLabel>
              <Input name="id" value={form.id} onChange={handleChange} />
            </FormControl>
            <FormControl mb={2} isRequired>
              <FormLabel>姓</FormLabel>
              <Input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb={2} isRequired>
              <FormLabel>名</FormLabel>
              <Input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb={2}>
              <FormLabel>付与日数</FormLabel>
              <Input
                name="total"
                type="number"
                min={0}
                value={form.total}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb={2}>
              <FormLabel>消化日数</FormLabel>
              <Input
                name="used"
                type="number"
                min={0}
                value={form.used}
                onChange={handleChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleAdd}>
              追加
            </Button>
            <Button onClick={onClose}>キャンセル</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default App;
