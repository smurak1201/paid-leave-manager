import { FormControl, FormLabel } from "@chakra-ui/form-control";
import {
  Button,
  Input,
  Stack,
  HStack,
  Icon,
  Box,
  Text,
} from "@chakra-ui/react";
import { User, BadgeInfo, X } from "lucide-react";
import type { Employee } from "./types";
import { CustomModal } from "../ui/CustomModal";
import { inputDateStyle } from "./icons";

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: Employee;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
  onSave: () => void;
  idError: string;
  editId: string | null;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  form,
  onChange,
  onAdd,
  onSave,
  idError,
  editId,
}) => {
  if (!isOpen) return null;
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
              onChange={onChange}
              borderColor="teal.300"
              bg="whiteAlpha.900"
              _placeholder={{ color: "teal.200" }}
              type="text"
              inputMode="numeric"
              pattern="^[0-9]*$"
              autoComplete="off"
              disabled={!!editId} // 編集時はid変更不可
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
              onChange={onChange}
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
              onChange={onChange}
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
            onChange={onChange}
            style={inputDateStyle}
            max={new Date().toISOString().slice(0, 10)}
          />
        </Box>
        <HStack justify="flex-end" gap={3}>
          <Button
            colorScheme="teal"
            onClick={editId ? onSave : onAdd}
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
