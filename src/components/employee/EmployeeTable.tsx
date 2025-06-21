import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/table";
import type { Employee } from "./types";
import { Box } from "@chakra-ui/react";

interface Props {
  employees: Employee[];
}

export const EmployeeTable = ({ employees }: Props) => (
  <Box overflowX="auto" borderRadius="md" boxShadow="sm" bg="white" p={4}>
    <Table variant="striped" colorScheme="teal" size="md">
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
  </Box>
);
