import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/table";
import type { Employee } from "./types";
import { Box, Text, Badge } from "@chakra-ui/react";

interface Props {
  employees: Employee[];
}

export const EmployeeTable = ({ employees }: Props) => (
  <Box
    overflowX="auto"
    borderRadius="lg"
    boxShadow="lg"
    bg="white"
    p={6}
    maxW="900px"
    mx="auto"
    mb={0}
    display="flex"
    justifyContent="center"
  >
    <Table
      variant="striped"
      colorScheme="teal"
      size="md"
      sx={{
        minWidth: "700px",
        "th, td": {
          fontSize: "md",
          py: 3,
        },
        th: {
          bg: "teal.50",
          color: "teal.700",
          fontWeight: "bold",
          letterSpacing: 1,
          textAlign: "center",
        },
        td: {
          textAlign: "center",
        },
        tbody: {
          tr: {
            transition: "background 0.2s",
            _hover: { bg: "teal.100" },
          },
        },
      }}
    >
      <Thead position="sticky" top={0} zIndex={1}>
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
        {employees.map((emp) => {
          const remain = emp.total - emp.used;
          return (
            <Tr key={emp.id}>
              <Td>{emp.id}</Td>
              <Td>{emp.lastName}</Td>
              <Td>{emp.firstName}</Td>
              <Td isNumeric>{emp.total}</Td>
              <Td isNumeric>{emp.used}</Td>
              <Td isNumeric>
                <Badge
                  colorScheme={
                    remain <= 3 ? "red" : remain <= 7 ? "yellow" : "teal"
                  }
                  fontSize="md"
                  px={3}
                  py={1}
                  borderRadius="md"
                  fontWeight="bold"
                >
                  {remain}
                </Badge>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  </Box>
);
