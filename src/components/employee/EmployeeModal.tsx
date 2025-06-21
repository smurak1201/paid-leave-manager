import { FormControl, FormLabel } from "@chakra-ui/form-control";
import {
  Button,
  Input,
  Stack,
  HStack,
  Icon,
  Box,
  Text,
  CloseButton,
} from "@chakra-ui/react";
import { User, BadgeInfo, CalendarPlus, CalendarCheck } from "lucide-react";
import type { Employee } from "./types";
import { CustomModal } from "../ui/CustomModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  form: Omit<Employee, "id"> & { id: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
}

export const EmployeeModal = ({
  isOpen,
  onClose,
  form,
  onChange,
  onAdd,
}: Props) => (
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
          従業員追加
        </Text>
      </HStack>
      <CloseButton
        position="absolute"
        top={2}
        right={2}
        color="teal.400"
        onClick={onClose}
        _focus={{ boxShadow: "0 0 0 2px teal.200" }}
        aria-label="閉じる"
      />
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
          />
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
        <FormControl>
          <FormLabel>
            <Icon as={CalendarPlus} mr={2} />
            付与日数
          </FormLabel>
          <Input
            name="total"
            type="number"
            min={0}
            value={form.total}
            onChange={onChange}
            borderColor="teal.300"
            bg="whiteAlpha.900"
            _placeholder={{ color: "teal.200" }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>
            <Icon as={CalendarCheck} mr={2} />
            消化日数
          </FormLabel>
          <Input
            name="used"
            type="number"
            min={0}
            value={form.used}
            onChange={onChange}
            borderColor="teal.300"
            bg="whiteAlpha.900"
            _placeholder={{ color: "teal.200" }}
          />
        </FormControl>
      </Stack>
      <HStack justify="flex-end" gap={3}>
        <Button
          colorScheme="teal"
          onClick={onAdd}
          borderRadius="full"
          px={6}
          fontWeight="bold"
          boxShadow="md"
        >
          <Icon as={User} mr={2} />
          追加
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
