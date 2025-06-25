import React from "react";
import { Td, Tr } from "@chakra-ui/table";
import { Badge, HStack, IconButton, Icon } from "@chakra-ui/react";
import { Icons } from "./icons";
import { Tooltip } from "../ui/tooltip";
import type { RowContentProps } from "./types";

export const EmployeeTableRow: React.FC<
  RowContentProps & { rowIndex?: number }
> = function EmployeeTableRow(props) {
  const {
    emp,
    grantThisYear,
    carryOver,
    used,
    remain,
    servicePeriod,
    onView,
    onEdit,
    handleDeleteClick,
    rowIndex,
  } = props;
  const [y, m, d] = emp.joinedAt.split("-");
  const joinedAtJp = `${y}年${Number(m)}月${d ? Number(d) + "日" : ""}`;
  // 奇数行: teal系, 残日数0: 薄い赤色
  let rowBg = undefined;
  if (remain === 0) {
    rowBg = "#FFF5F5";
  } else if (typeof rowIndex === "number" && rowIndex % 2 === 1) {
    rowBg = "rgba(0,128,128,0.06)";
  }
  return (
    <Tr bg={rowBg} transition="background 0.3s">
      <Td fontWeight="bold" color="teal.700" fontSize="md">
        {emp.employeeId}
      </Td>
      <Td color="gray.700">{emp.lastName}</Td>
      <Td color="gray.700">{emp.firstName}</Td>
      <Td color="gray.600">{joinedAtJp}</Td>
      <Td color="gray.600">{servicePeriod}</Td>
      <Td isNumeric color="teal.700">
        {grantThisYear}
      </Td>
      <Td isNumeric color="teal.700">
        {carryOver}
      </Td>
      <Td isNumeric color="teal.700">
        {used}
      </Td>
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
          boxShadow="sm"
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
    </Tr>
  );
};
