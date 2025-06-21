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
  // 空の従業員初期値（追加時用）
  const emptyEmployee: Employee = {
    id: "",
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
  const [idInputValue, setIdInputValue] = useState(form.id);

  useEffect(() => {
    // 編集モードや初期化時にidInputValueも同期
    setIdInputValue(form.id);
  }, [employeeId, employee]);

  // employeeIdまたは従業員データが変わったらformを再初期化
  useEffect(() => {
    if (employeeId) {
      // 編集モード: 該当従業員データで初期化
      setForm(employee ?? emptyEmployee);
    } else {
      // 追加モード: 空の初期値で初期化
      setForm(emptyEmployee);
    }
  }, [employeeId, employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return;
    if (e.target.name === "id") {
      setIdInputValue(e.target.value); // 入力値はそのまま表示
      // 数字以外が含まれていればエラー
      if (e.target.value && !/^[0-9]*$/.test(e.target.value)) {
        // setIdErrorはAppから渡されるので、数字以外ならエラー
        if (typeof window !== "undefined") {
          const event = new CustomEvent("setIdError", {
            detail: "数字を入力してください",
          });
          window.dispatchEvent(event);
        }
      } else {
        // setIdErrorをクリア
        if (typeof window !== "undefined") {
          const event = new CustomEvent("setIdError", { detail: "" });
          window.dispatchEvent(event);
        }
        // form.idも数字のみ反映
        setForm({ ...form, id: e.target.value });
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // setIdErrorをAppから受け取るためのwindowイベントリスナー
  useEffect(() => {
    const handler = (e: any) => {
      if (typeof e.detail === "string" && typeof idError === "string") {
        if (idError !== e.detail) {
          // idErrorがpropsで渡されている場合はApp側で管理
        }
      }
    };
    window.addEventListener("setIdError", handler);
    return () => window.removeEventListener("setIdError", handler);
  }, [idError]);

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
            {idInputValue && !/^[0-9]*$/.test(idInputValue) && (
              <Text color="red.500" fontSize="sm" mt={1}>
                数字を入力してください
              </Text>
            )}
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
