import React, { useState, useEffect, useRef } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/table";
import type { Employee } from "./types";
import { Box, Badge, IconButton, HStack, Icon } from "@chakra-ui/react";
import { Icons, getServicePeriod } from "./icons";
import { calcLeaveDays } from "./utils";
import { Tooltip } from "../ui/tooltip";
import { ConfirmDeleteModal } from "../ui/ConfirmDeleteModal";
import { FadeTableRow } from "./FadeTableRow";
import { AnimatePresence } from "framer-motion";

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
}) => {
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const prevEmployeesRef = useRef<Employee[]>(employees);

  // 追加時にrecentlyAddedIdをセットし、1秒後に解除
  useEffect(() => {
    const prev = prevEmployeesRef.current;
    if (employees.length > prev.length) {
      // 新規追加された従業員を特定
      const added = employees.find((e) => !prev.some((p) => p.id === e.id));
      if (added) {
        setRecentlyAddedId(added.id);
        setTimeout(() => setRecentlyAddedId(null), 1000);
      }
    }
    prevEmployeesRef.current = employees;
  }, [employees]);

  const handleDeleteClick = (emp: Employee) => {
    setDeleteTarget(emp);
    setDeleteOpen(true);
  };
  const handleDeleteConfirm = () => {
    if (deleteTarget) onDelete(deleteTarget);
    setDeleteOpen(false);
    setDeleteTarget(null);
  };
  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  interface RowContentProps {
    emp: Employee;
    grantThisYear: number;
    carryOver: number;
    used: number;
    remain: number;
    servicePeriod: string;
    onView: (emp: Employee) => void;
    onEdit: (emp: Employee) => void;
    handleDeleteClick: (emp: Employee) => void;
  }

  const RowContent: React.FC<RowContentProps> = ({
    emp,
    grantThisYear,
    carryOver,
    used,
    remain,
    servicePeriod,
    onView,
    onEdit,
    handleDeleteClick,
  }) => (
    <>
      <Td>{emp.id}</Td>
      <Td>{emp.lastName}</Td>
      <Td>{emp.firstName}</Td>
      <Td>
        {(() => {
          const [y, m, d] = emp.joinedAt.split("-");
          return `${y}年${Number(m)}月${d ? Number(d) + "日" : ""}`;
        })()}
      </Td>
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
              onClick={() => handleDeleteClick(emp)}
            >
              <Icon as={Icons.Trash2} boxSize={5} />
            </IconButton>
          </Tooltip>
        </HStack>
      </Td>
    </>
  );

  return (
    <Box
      overflowX="auto"
      borderRadius="lg"
      boxShadow="lg"
      bg="white"
      p={2}
      maxW="100vw"
      mx="auto"
      mb={0}
      display="block"
      style={{ minWidth: 0 }}
    >
      <Table
        variant="striped"
        colorScheme="teal"
        size="sm"
        sx={{
          minWidth: 600,
          width: "100%",
          "th, td": {
            fontSize: "sm",
            py: [1, 2],
            px: [1, 2],
            whiteSpace: "nowrap",
            textAlign: "center", // すべて中央揃え
          },
          th: {
            bg: "teal.50",
            color: "teal.700",
            fontWeight: "bold",
            letterSpacing: 1,
            textAlign: "center", // ヘッダーも中央揃え
          },
          td: {
            textAlign: "center", // データも中央揃え
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
            <Th>入社年月</Th>
            <Th>勤続年数</Th>
            <Th isNumeric>今年度付与</Th>
            <Th isNumeric>繰越</Th>
            <Th isNumeric>消化日数</Th>
            <Th isNumeric>残日数</Th>
            <Th minW="120px">操作</Th>
          </Tr>
        </Thead>
        <Tbody>
          <AnimatePresence>
            {employees.map((emp) => {
              const used = emp.leaveDates.length;
              const now = new Date();
              let grantThisYear = 0;
              let carryOver = 0;
              let foundGrant = false;
              if (emp.grants && emp.grants.length > 0) {
                emp.grants.forEach((g) => {
                  const grantDate = new Date(g.grantDate);
                  const grantYear = grantDate.getFullYear();
                  const nowYear = now.getFullYear();
                  const diffMonth =
                    (now.getFullYear() - grantDate.getFullYear()) * 12 +
                    (now.getMonth() - grantDate.getMonth());
                  if (grantYear === nowYear && diffMonth < 24) {
                    // 今年付与された分（消化数は考慮しない）
                    grantThisYear += g.days;
                    foundGrant = true;
                  } else if (diffMonth < 24) {
                    // 今年度以外の有効な繰越分（消化数は考慮しない）
                    carryOver += g.days;
                  }
                });
              }
              // grantがなければ勤続年数から日本の制度通りの付与日数を算出
              if (!foundGrant) {
                // 勤続年数（月単位）から付与日数を返す
                grantThisYear = calcLeaveDays(emp.joinedAt, now);
              }
              const remain = grantThisYear + carryOver - used;
              const servicePeriod = getServicePeriod(emp.joinedAt);
              const rowProps = {
                emp,
                grantThisYear,
                carryOver,
                used,
                remain,
                servicePeriod,
                onView,
                onEdit,
                handleDeleteClick,
              };
              const style =
                remain === 0 ? { background: "#FFF5F5" } : undefined;
              return (
                <FadeTableRow key={emp.id} style={style}>
                  <RowContent {...rowProps} />
                </FadeTableRow>
              );
            })}
          </AnimatePresence>
        </Tbody>
      </Table>
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        targetName={
          deleteTarget
            ? `${deleteTarget.lastName} ${deleteTarget.firstName}`
            : undefined
        }
      />
    </Box>
  );
};
