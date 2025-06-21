// =============================
// EmployeeModal.tsx
// 従業員追加・編集モーダルコンポーネント
// =============================
//
// このファイルは従業員の追加・編集用モーダルUI部品です。
// - propsとしてモーダル開閉状態・従業員ID・従業員取得関数・追加/保存ハンドラ・バリデーションエラー等を受け取る
// - 入力フォームの状態・バリデーションはカスタムフックで共通化
// - propsは「idのみ受け取り、データ参照はAppのstateから行う」形に統一
// - UI部品の小コンポーネント化・責務分離・型安全性を徹底
//
// 設計意図:
// - モーダルの責務は「フォームUIとバリデーション表示」のみに限定
// - 業務ロジックや状態管理は親(App)で一元化
// - 初学者でも理解しやすいように全体の流れ・propsの意味を日本語コメントで明記
//
// propsの型定義。親(App)から必要な情報・関数を受け取る
interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string | null;
  getEmployee: (id: string) => Employee | undefined;
  onAdd: (form: Employee) => void;
  onSave: (form: Employee) => void;
  idError: string;
  editId: string | null;
}

// 型定義のインポート
import type { Employee } from "./types";
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
import { FormControl } from "@chakra-ui/form-control";
import { FormLabel } from "@chakra-ui/form-control";
import { User, X, BadgeInfo } from "lucide-react";
import { inputDateStyle } from "./icons";
import { CustomModal } from "../ui/CustomModal";

// モーダル本体
export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  employeeId,
  getEmployee,
  onAdd,
  onSave,
  idError,
  editId,
}) => {
  const employee = employeeId ? getEmployee(employeeId) : undefined;
  const [form, setForm] = useState<Employee | undefined>(employee);

  useEffect(() => {
    setForm(employee);
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
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
              value={form.id}
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
            {idError && (
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
