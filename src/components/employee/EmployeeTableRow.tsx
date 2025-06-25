import React from "react";
import { Td } from "@chakra-ui/table";
import { Badge, HStack, IconButton, Icon } from "@chakra-ui/react";
import { Icons } from "./icons";
import { Tooltip } from "../ui/tooltip";
import type { RowContentProps } from "./types";

export const EmployeeTableRow: React.FC<RowContentProps> = ({
  emp,
  grantThisYear,
  carryOver,
  used,
  remain,
  servicePeriod,
  onView,
  onEdit,
  handleDeleteClick,
}) => {
  const [y, m, d] = emp.joinedAt.split("-");
  const joinedAtJp = `${y}年${Number(m)}月${d ? Number(d) + "日" : ""}`;
  return (
    <tr>
      <Td>{emp.employeeId}</Td>
      <Td>{emp.lastName}</Td>
      <Td>{emp.firstName}</Td>
      <Td>{joinedAtJp}</Td>
      <Td>{servicePeriod}</Td>
      <Td isNumeric>{grantThisYear}</Td>
      <Td isNumeric>{carryOver}</Td>
      <Td isNumeric>{used}</Td>
      <Td isNumeric>
        <Badge
          colorScheme={remain <= 3 ? "red" : remain <= 7 ? "yellow" : "teal"}
          fontSize="md"
          px={3}
          py={1}
          borderRadius="md"
          fontWeight="bold"
          minW="3em"
          textAlign="center"
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
              onClick={() => onView(emp.employeeId)}
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
              onClick={() => onEdit(emp.employeeId)}
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
              onClick={() => handleDeleteClick(emp.employeeId)}
            >
              <Icon as={Icons.Trash2} boxSize={5} />
            </IconButton>
          </Tooltip>
        </HStack>
      </Td>
    </tr>
  );
};
