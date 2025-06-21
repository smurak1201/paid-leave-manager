import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/table";
import type { Employee } from "./types";
import { Box, Badge, IconButton, HStack, Icon } from "@chakra-ui/react";
import { Icons } from "./icons";
import { Tooltip } from "../ui/tooltip";

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (emp: Employee) => void;
  onDelete: (emp: Employee) => void;
  onView: (emp: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onEdit,
  onDelete,
  onView,
}) => (
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
          <Th minW="100px">操作</Th>
        </Tr>
      </Thead>
      <Tbody>
        {employees.map((emp) => {
          const used = emp.leaveDates.length;
          const remain = emp.total - used;
          return (
            <Tr key={emp.id} sx={remain === 0 ? { bg: "#FFF5F5" } : undefined}>
              <Td>{emp.id}</Td>
              <Td>{emp.lastName}</Td>
              <Td>{emp.firstName}</Td>
              <Td isNumeric>{emp.total}</Td>
              <Td isNumeric>{used}</Td>
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
              <Td>
                <HStack justify="center" gap={1}>
                  <Tooltip content="確認" showArrow>
                    <IconButton
                      aria-label="確認"
                      size="sm"
                      variant="ghost"
                      colorScheme="blue"
                      onClick={() => onView && onView(emp)}
                    >
                      <Icon as={Icons.Eye} boxSize={5} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content="編集" showArrow>
                    <IconButton
                      aria-label="編集"
                      size="sm"
                      variant="ghost"
                      colorScheme="teal"
                      onClick={() => onEdit && onEdit(emp)}
                    >
                      <Icon as={Icons.Edit} boxSize={5} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content="削除" showArrow>
                    <IconButton
                      aria-label="削除"
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => onDelete && onDelete(emp)}
                    >
                      <Icon as={Icons.Trash2} boxSize={5} />
                    </IconButton>
                  </Tooltip>
                </HStack>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  </Box>
);
