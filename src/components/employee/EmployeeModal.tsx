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
//
// ===== import: 型定義 =====
import type { Employee } from "./types";

// ===== import: 外部ライブラリ =====
import React, { useState, useEffect } from "react";
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

// ===== import: アイコン・UI部品 =====
import { inputDateStyle } from "./icons";
import { CustomModal } from "../ui/CustomModal";

// propsの型定義。親(App)から必要な情報・関数を受け取る
interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: number | null;
  getEmployee: (id: number) => Employee | undefined;
  onAdd: (form: Employee) => void;
  onSave: (form: Employee) => void;
  idError: string;
  editId: number | null;
  employees: Employee[];
  setIdError: (msg: string) => void;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  employeeId,
  getEmployee,
  onAdd,
  onSave,
  idError,
  editId,
  employees, // ← ここでpropsとして受け取っているので、handleChange内もemployeesでOK
  setIdError,
}) => {
  // 空の従業員初期値（追加時用）
  const emptyEmployee: Employee = {
    id: NaN,
    lastName: "",
    firstName: "",
    joinedAt: "",
    total: 20,
    used: 0,
    leaveDates: [],
    grants: [],
    carryOver: 0,
  };

  // employeeIdがnullなら追加モード、従業員データがあれば編集モード
  const employee = employeeId ? getEmployee(employeeId) : undefined;
  // 追加時は空の初期値、編集時は従業員データでformを初期化
  const [form, setForm] = useState<Employee>(
    employeeId ? employee ?? emptyEmployee : emptyEmployee
  );
  // id入力欄の値（数字以外も含めて表示）
  const [idInputValue, setIdInputValue] = useState(
    form.id ? String(form.id) : ""
  );

  // 編集モードや初期化時にidInputValueも同期
  useEffect(() => {
    setIdInputValue(form.id ? String(form.id) : "");
  }, [employeeId, employee]);

  // employeeIdまたは従業員データが変わったらformを再初期化
  useEffect(() => {
    if (employeeId) {
      setForm(employee ?? emptyEmployee);
    } else {
      setForm(emptyEmployee);
    }
  }, [employeeId, employee]);

  // モーダルが閉じられたときにフォーム内容を初期化
  useEffect(() => {
    if (!isOpen) {
      setForm(emptyEmployee);
      setIdInputValue("");
    }
  }, [isOpen]);

  // 入力欄のonChangeハンドラ（id重複・数字バリデーションはuseEmployeeFormに集約）
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return;
    if (e.target.name === "id") {
      setIdInputValue(e.target.value); // 入力値はそのまま表示
      // 入力のたびにバリデーション（数字以外・重複・必須を即時チェック）
      if (e.target.value && !/^[0-9]*$/.test(e.target.value)) {
        setIdError("従業員コードは半角数字のみ入力できます");
      } else if (
        e.target.value &&
        employees.some(
          (emp) =>
            emp.id === Number(e.target.value) &&
            (editId === null || emp.id !== editId)
        )
      ) {
        setIdError("従業員コードが重複しています");
      } else if (!e.target.value) {
        setIdError("従業員コードは必須です");
      } else {
        setIdError("");
      }
      setForm({ ...form, id: e.target.value ? Number(e.target.value) : NaN });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  if (!isOpen || !form) return null;
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <Box position="relative">
        <HStack justify="center" gap={2} mb={6}>
          <Icon as={User} color="teal.400" boxSize={6} />
          <Text
            as="span"
            fontWeight="bold"
            color="teal.700"
            fontSize="xl"
            letterSpacing={1}
          >
            {editId ? "従業員編集" : "従業員追加"}
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
              name="id"
              value={idInputValue}
              onChange={handleChange}
              borderColor="teal.300"
              bg="whiteAlpha.900"
              _placeholder={{ color: "teal.200" }}
              type="text"
              inputMode="numeric"
              pattern="^[0-9]*$"
              autoComplete="off"
              disabled={!!editId}
            />
            {/* 入力中のidエラーを即時表示（1回のみ表示） */}
            {idInputValue && idError && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {idError}
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
            onClick={() => (editId ? onSave(form) : onAdd(form))}
            borderRadius="full"
            px={6}
            fontWeight="bold"
            boxShadow="md"
            disabled={
              !!idError ||
              !form.id ||
              !form.lastName ||
              !form.firstName ||
              !form.joinedAt
            }
            cursor={
              !!idError ||
              !form.id ||
              !form.lastName ||
              !form.firstName ||
              !form.joinedAt
                ? "not-allowed"
                : "pointer"
            }
            _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
          >
            <Icon as={User} mr={2} />
            {editId ? "保存" : "追加"}
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
