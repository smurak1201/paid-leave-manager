import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/modal";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Button, Input, Stack, HStack, Icon } from "@chakra-ui/react";
import { User, BadgeInfo, CalendarPlus, CalendarCheck } from "lucide-react";
import type { Employee } from "./types";

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
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent
      bg="white"
      boxShadow="2xl"
      maxW="400px"
      w="90%"
      margin="auto"
      border="2px solid"
      borderColor="teal.400"
      borderRadius="xl"
    >
      <ModalHeader textAlign="center" color="teal.700" fontWeight="bold">
        <HStack justify="center" gap={2}>
          <Icon as={User} color="teal.400" boxSize={6} />
          <span>従業員追加</span>
        </HStack>
      </ModalHeader>
      <ModalCloseButton color="teal.400" />
      <ModalBody>
        <Stack gap={3}>
          <FormControl isRequired>
            <FormLabel>
              <Icon as={BadgeInfo} mr={2} />
              従業員コード
            </FormLabel>
            <Input
              name="id"
              value={form.id}
              onChange={onChange}
              borderColor="teal.400"
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
              borderColor="teal.400"
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
              borderColor="teal.400"
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
              borderColor="teal.400"
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
              borderColor="teal.400"
            />
          </FormControl>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button
          colorScheme="teal"
          mr={3}
          onClick={onAdd}
          borderRadius="full"
          px={6}
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
        >
          キャンセル
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
