// =============================
// EmployeeModal.tsx
// 従業員追加・編集モーダル
// =============================
//
// 役割:
// ・従業員の追加・編集フォームUIを表示
// ・バリデーションや初期化、入力値管理などフォームのロジックを担当
//
// 設計意図:
// ・型安全・責務分離・UI/UX・可読性重視
// ・フォームの状態管理やバリデーションはこのコンポーネントで完結
// ・UI部品の責務を明確にし、親コンポーネントはデータ管理に専念できるようにする

// ===== import: 型定義 =====
import type { Employee } from "./types";
// ===== import: React本体・フック =====
import React, { useState, useEffect } from "react";
// ===== import: Chakra UI部品 =====
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
// ===== import: アイコン =====
import { User, X, BadgeInfo } from "lucide-react";
// ===== import: カスタムUI部品・ユーティリティ =====
import { CustomModal } from "../ui/CustomModal";
import { validateEmployeeId } from "./utils";

// props型: モーダルの開閉状態・従業員データ・追加/保存ハンドラなどを親から受け取る
interface EmployeeModalProps {
  isOpen: boolean; // モーダル表示状態
  onClose: () => void; // モーダルを閉じる関数
  employee: Employee | null; // 編集対象の従業員（新規追加時はnull）
  employees: Employee[]; // 全従業員リスト（ID重複チェック用）
  onAdd: (form: Omit<Employee, "id">) => void; // 追加時のハンドラ
  onSave: (form: Employee) => void; // 編集保存時のハンドラ
}

// 入力フォームの型: 入力中はemployeeIdはstringで保持
export type FormType = Omit<Employee, "employeeId"> & { employeeId: string };
const emptyForm: FormType = {
  id: NaN,
  employeeId: "",
  lastName: "",
  firstName: "",
  joinedAt: "",
};

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  employee,
  employees,
  onAdd,
  onSave,
}) => {
  // 入力フォームの状態
  const [form, setForm] = useState<FormType>(emptyForm);
  // 従業員IDのバリデーションエラー
  const [employeeIdError, setEmployeeIdError] = useState("");

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
  }, [isOpen, employee]);

  // 入力欄のonChangeハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "employeeId")
      setEmployeeIdError(validateEmployeeId(value, employee, employees));
  };

  const isSaveDisabled = () =>
    !!employeeIdError ||
    !form.employeeId ||
    !form.lastName ||
    !form.firstName ||
    !form.joinedAt;

  const handleSave = () => {
    const submitForm = { ...form, employeeId: Number(form.employeeId) };
    employee
      ? onSave(submitForm as Employee)
      : onAdd(submitForm as Omit<Employee, "id">);
  };

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
            style={{
              border: "1px solid #B2F5EA",
              borderRadius: 6,
              padding: "6px 12px",
              fontSize: 16,
              outline: "none",
              width: "100%",
            }}
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
            disabled={isSaveDisabled()}
            cursor={isSaveDisabled() ? "not-allowed" : "pointer"}
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
