// =============================
// EmployeeModal.tsx
// 従業員追加・編集モーダル
// =============================
//
// 役割:
// ・従業員の追加・編集フォームUI
// ・バリデーション・初期化・props/state流れを明確化
//
// 設計意図:
// ・型安全・責務分離・UI/UX・可読性重視
// ・props/stateの流れ・UI部品の責務を日本語コメントで明記

import type { Employee } from "../../types/employee";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  HStack,
  Stack,
  Button,
  Icon,
  Text,
  Input,
} from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { User, X, BadgeInfo } from "lucide-react";
import { inputDateStyle } from "./icons";
import { CustomModal } from "../ui/CustomModal";

export interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  employees: Employee[];
  onAdd: (form: Omit<Employee, "id">) => void;
  onSave: (form: Employee) => void;
  onDelete?: (employeeId: number) => Promise<void>;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  employee,
  employees,
  onAdd,
  onSave,
}) => {
  // form型: 入力中はemployeeIdはstringで保持
  type FormType = Omit<Employee, "employeeId"> & { employeeId: string };
  const emptyForm: FormType = {
    id: NaN,
    employeeId: "",
    lastName: "",
    firstName: "",
    joinedAt: "",
  };
  const [form, setForm] = useState<FormType>(emptyForm);
  const [employeeIdError, setEmployeeIdError] = useState("");

  // バリデーション関数
  const validateEmployeeId = (value: string): string => {
    if (value === "") return "従業員コードは必須です";
    if (!/^[0-9]+$/.test(value))
      return "従業員コードは半角数字のみ入力できます";
    if (!employee && employees.some((emp) => String(emp.employeeId) === value))
      return "従業員コードが重複しています";
    return "";
  };

  // 初期化・リセット
  const resetForm = () => {
    if (employee) {
      setForm({ ...employee, employeeId: String(employee.employeeId) });
    } else {
      setForm(emptyForm);
    }
    setEmployeeIdError("");
  };

  useEffect(() => {
    if (isOpen) resetForm();
    // eslint-disable-next-line
  }, [isOpen, employee]);

  // 入力欄のonChangeハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "employeeId") setEmployeeIdError(validateEmployeeId(value));
  };

  const isSaveDisabled = useMemo(
    () =>
      !!employeeIdError ||
      !form.employeeId ||
      !form.lastName ||
      !form.firstName ||
      !form.joinedAt,
    [employeeIdError, form]
  );

  const handleSave = useCallback(() => {
    const submitForm = { ...form, employeeId: Number(form.employeeId) };
    employee
      ? onSave(submitForm as Employee)
      : onAdd(submitForm as Omit<Employee, "id">);
  }, [employee, form, onAdd, onSave]);

  if (!isOpen) return null;
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      {/* GuideModalと同様、白背景・角丸・影付きBoxでラップ */}
      <Box
        position="relative"
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        p={6}
        minW="320px"
        maxW="420px"
        w="95%"
      >
        <HStack justify="center" gap={2} mb={6}>
          <Icon as={User} color="teal.400" boxSize={6} />
          <Text
            as="span"
            fontWeight="bold"
            color="teal.700"
            fontSize="xl"
            letterSpacing={1}
          >
            {employee ? "従業員編集" : "従業員追加"}
          </Text>
        </HStack>
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
          aria-label="閉じる"
        >
          <Icon as={X} boxSize={4} />
        </Button>
        <Stack gap={3} mb={6}>
          <FormControl isRequired isInvalid={!!employeeIdError}>
            <FormLabel>
              <Icon as={BadgeInfo} mr={2} />
              従業員コード
            </FormLabel>
            <Input
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              borderColor="teal.300"
              bg={employee ? "gray.100" : "whiteAlpha.900"}
              color={employee ? "gray.500" : undefined}
              _placeholder={{ color: "teal.200" }}
              type="text"
              inputMode="numeric"
              pattern="^[0-9]*$"
              autoComplete="off"
              disabled={!!employee}
            />
            {employeeIdError && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {employeeIdError}
              </Text>
            )}
            {employee && (
              <Text color="gray.400" fontSize="xs" mt={1}>
                ※従業員コードは編集できません
              </Text>
            )}
          </FormControl>
          <FormControl isRequired>
            <FormLabel>
              <Icon as={User} mr={2} />姓
            </FormLabel>
            <Input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              borderColor="teal.300"
              bg="whiteAlpha.900"
              _placeholder={{ color: "teal.200" }}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>
              <Icon as={User} mr={2} />名
            </FormLabel>
            <Input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              borderColor="teal.300"
              bg="whiteAlpha.900"
              _placeholder={{ color: "teal.200" }}
            />
          </FormControl>
        </Stack>
        <Box mb={4}>
          <Text fontWeight="bold" mb={1}>
            入社年月日
          </Text>
          <input
            type="date"
            name="joinedAt"
            value={form.joinedAt || ""}
            onChange={handleChange}
            style={inputDateStyle}
          />
        </Box>
        <HStack justify="flex-end" gap={3}>
          <Button
            colorScheme="teal"
            onClick={handleSave}
            borderRadius="full"
            px={6}
            fontWeight="bold"
            boxShadow="md"
            disabled={isSaveDisabled}
            cursor={isSaveDisabled ? "not-allowed" : "pointer"}
            _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
          >
            <Icon as={User} mr={2} />
            {employee ? "保存" : "追加"}
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            colorScheme="teal"
            borderRadius="full"
            px={6}
            fontWeight="bold"
          >
            キャンセル
          </Button>
        </HStack>
      </Box>
    </CustomModal>
  );
};
