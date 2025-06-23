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
  employeeId: string | null;
  getEmployee: (employeeId: string) => Employee | undefined;
  onAdd: (form: Omit<Employee, "id">) => void;
  onSave: (form: Employee) => void;
  onDelete?: (employeeId: string) => Promise<void>;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  employeeId,
  getEmployee,
  onAdd,
  onSave,
}) => {
  // 空の従業員初期値（追加時用）
  const emptyEmployee: Employee = {
    id: NaN,
    employeeId: "",
    lastName: "",
    firstName: "",
    joinedAt: "",
  };

  // employeeIdがnullなら追加モード、従業員データがあれば編集モード
  const employee = employeeId ? getEmployee(employeeId) : undefined;
  // 追加時は空の初期値、編集時は従業員データでformを初期化
  const [form, setForm] = useState<Employee>(
    employeeId ? employee ?? emptyEmployee : emptyEmployee
  );
  // employeeId入力欄の値（数字以外も含めて表示）
  const [employeeIdInputValue, setEmployeeIdInputValue] = useState(
    form.employeeId ? String(form.employeeId) : ""
  );
  // employeeIdエラー（内部stateで管理）
  const [employeeIdError, setEmployeeIdError] = useState("");

  // 編集モードや初期化時にemployeeIdInputValueも同期
  useEffect(() => {
    setEmployeeIdInputValue(form.employeeId ? String(form.employeeId) : "");
  }, [form.employeeId]);

  // employeeIdまたはisOpenが変わったらform/employeeIdInputValue/employeeIdErrorを初期化
  useEffect(() => {
    if (employeeId !== null && isOpen) {
      const employee = getEmployee(employeeId);
      setForm({
        id: employee?.id ?? NaN,
        employeeId: employee ? String(employee.employeeId) : "",
        lastName: employee?.lastName ?? "",
        firstName: employee?.firstName ?? "",
        joinedAt: employee?.joinedAt ?? "",
      });
      setEmployeeIdInputValue(
        employee && employee.employeeId ? String(employee.employeeId) : ""
      );
      setEmployeeIdError("");
    } else if (isOpen) {
      setForm({
        id: NaN,
        employeeId: "",
        lastName: "",
        firstName: "",
        joinedAt: "",
      });
      setEmployeeIdInputValue("");
      setEmployeeIdError("");
    }
  }, [employeeId, isOpen, getEmployee]);

  // モーダルが閉じられたときにフォーム内容を初期化
  useEffect(() => {
    if (!isOpen) {
      setForm(emptyEmployee);
      setEmployeeIdInputValue("");
      setEmployeeIdError("");
    }
  }, [isOpen]);

  // 入力欄のonChangeハンドラ（employeeId重複・数字バリデーションを内部で完結）
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return;
    if (e.target.name === "employeeId") {
      setEmployeeIdInputValue(e.target.value); // 入力値はそのまま表示
      if (e.target.value && !/^[0-9]*$/.test(e.target.value)) {
        setEmployeeIdError("従業員コードは半角数字のみ入力できます");
      } else if (
        e.target.value &&
        e.target.value !== (employeeId ?? "") &&
        getEmployee(e.target.value)
      ) {
        setEmployeeIdError("従業員コードが重複しています");
      } else if (!e.target.value) {
        setEmployeeIdError("従業員コードは必須です");
      } else {
        setEmployeeIdError("");
      }
      setForm({
        ...form,
        employeeId: e.target.value,
      });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
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
    if (employeeId) {
      onSave(form);
    } else {
      onAdd(form);
    }
  }, [employeeId, form, onAdd, onSave]);

  if (!isOpen || !form) return null;
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
            {employeeId ? "従業員編集" : "従業員追加"}
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
          <FormControl isRequired>
            <FormLabel>
              <Icon as={BadgeInfo} mr={2} />
              従業員コード
            </FormLabel>
            <Input
              name="employeeId"
              value={
                employeeId ? String(form.employeeId) : employeeIdInputValue
              }
              onChange={handleChange}
              borderColor="teal.300"
              bg={employeeId ? "gray.100" : "whiteAlpha.900"}
              color={employeeId ? "gray.500" : undefined}
              _placeholder={{ color: "teal.200" }}
              type="text"
              inputMode="numeric"
              pattern="^[0-9]*$"
              autoComplete="off"
              disabled={!!employeeId}
            />
            {employeeIdInputValue && employeeIdError && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {employeeIdError}
              </Text>
            )}
            {employeeId && (
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
            {employeeId ? "保存" : "追加"}
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
