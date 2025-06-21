import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { X, Plus } from "lucide-react";
import React from "react";
import { Icons, inputDateStyle, inputDateSmallStyle } from "./icons";
import { calcLeaveDays } from "./utils";
import type { Employee } from "./types";

interface LeaveDatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string | null;
  employees: Employee[];
  editDateIdx: number | null;
  dateInput: string;
  onAddDate: () => void;
  onEditDate: (idx: number) => void;
  onSaveDate: () => void;
  onDeleteDate: (idx: number) => void;
}

export const LeaveDatesModal: React.FC<LeaveDatesModalProps> = ({
  isOpen,
  onClose,
  employeeId,
  employees,
  editDateIdx,
  dateInput,
  onAddDate,
  onEditDate,
  onSaveDate,
  onDeleteDate,
}) => {
  const employee = employeeId
    ? employees.find((e) => e.id === employeeId) || null
    : null;
  if (!isOpen || !employee) return null;
  const dates = employee.leaveDates;
  // 一覧と同じ「付与＋繰越－消化」単純計算
  const now = new Date();
  let grantThisYear = 0;
  let carryOver = 0;
  let foundGrant = false;
  if (employee.grants && employee.grants.length > 0) {
    employee.grants.forEach((g) => {
      const grantDate = new Date(g.grantDate);
      const grantYear = grantDate.getFullYear();
      const nowYear = now.getFullYear();
      const diffMonth =
        (now.getFullYear() - grantDate.getFullYear()) * 12 +
        (now.getMonth() - grantDate.getMonth());
      if (grantYear === nowYear && diffMonth < 24) {
        grantThisYear += g.days;
        foundGrant = true;
      } else if (grantYear === nowYear - 1 && diffMonth < 24) {
        carryOver += g.days;
      }
    });
  }
  if (!foundGrant) {
    grantThisYear = calcLeaveDays(employee.joinedAt, now);
  }
  const remainSimple = grantThisYear + carryOver - dates.length;
  return (
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
      onClick={onClose}
    >
      <Box
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        p={6}
        minW="340px"
        maxW="90vw"
        position="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          position="absolute"
          top={2}
          right={2}
          size="sm"
          variant="ghost"
          colorScheme="teal"
          onClick={onClose}
          p={2}
          minW={"auto"}
        >
          <X size={18} />
        </Button>
        <Heading as="h3" size="md" mb={4} color="teal.700" textAlign="center">
          {employee.lastName} {employee.firstName} さんの有給取得日
        </Heading>
        <Text color="teal.700" fontWeight="bold" mb={1} textAlign="center">
          消化日数：{dates.length}日
        </Text>
        <Text color="teal.700" fontWeight="bold" mb={2} textAlign="center">
          残日数：{remainSimple}日
        </Text>
        <Box display="flex" gap={2} mb={4}>
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            style={inputDateStyle}
            maxLength={10}
          />
          {editDateIdx === null ? (
            <Button
              colorScheme="teal"
              onClick={onAddDate}
              px={4}
              minW={"auto"}
              disabled={
                remainSimple === 0 ||
                !dateInput.match(/^[\d]{4}-[\d]{2}-[\d]{2}$/)
              }
              cursor={
                remainSimple === 0 ||
                !dateInput.match(/^[\d]{4}-[\d]{2}-[\d]{2}$/)
                  ? "not-allowed"
                  : "pointer"
              }
              _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
            >
              <Plus size={16} style={{ marginRight: 6 }} />
              追加
            </Button>
          ) : (
            <Button
              colorScheme="teal"
              onClick={onSaveDate}
              px={4}
              minW={"auto"}
              disabled={
                remainSimple === 0 ||
                !dateInput.match(/^[\d]{4}-[\d]{2}-[\d]{2}$/)
              }
              cursor={
                remainSimple === 0 ||
                !dateInput.match(/^[\d]{4}-[\d]{2}-[\d]{2}$/)
                  ? "not-allowed"
                  : "pointer"
              }
              _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
            >
              <Icons.Edit size={16} style={{ marginRight: 6 }} />
              保存
            </Button>
          )}
        </Box>
        {dates.length === 0 ? (
          <Text color="gray.500" textAlign="center">
            取得履歴なし
          </Text>
        ) : (
          <Box as="ul" pl={0} m={0}>
            {dates.map((date, i) => {
              const [y, m, d] = date.split("-");
              const jpDate = `${y}年${m}月${d}日`;
              return (
                <Box
                  as="li"
                  key={date + i}
                  fontSize="md"
                  color="teal.700"
                  py={2}
                  px={4}
                  borderBottom={
                    i !== dates.length - 1 ? "1px solid" : undefined
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
                  {editDateIdx === i ? (
                    <input
                      type="date"
                      value={dateInput}
                      onChange={(e) => setDateInput(e.target.value)}
                      style={inputDateSmallStyle}
                      maxLength={10}
                    />
                  ) : (
                    <Text>{jpDate}</Text>
                  )}
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="teal"
                    minW={"auto"}
                    px={2}
                    onClick={() =>
                      editDateIdx === i ? setEditDateIdx(null) : onEditDate(i)
                    }
                    aria-label="編集"
                  >
                    <Icons.Edit size={15} />
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    minW={"auto"}
                    px={2}
                    onClick={() => onDeleteDate(i)}
                    aria-label="削除"
                  >
                    <Icons.Trash2 size={15} />
                  </Button>
                </Box>
              );
            })}
          </Box>
        )}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
          <Button onClick={onClose} variant="ghost" colorScheme="teal">
            キャンセル
          </Button>
        </Box>
        {remainSimple <= 0 && (
          <Text color="red.500" fontSize="sm" mt={2} textAlign="right">
            残日数が0の場合、有給取得日は登録できません。
          </Text>
        )}
      </Box>
    </Box>
  );
};
