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
import { Button, Input, Stack } from "@chakra-ui/react";
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
      boxShadow="xl"
      maxW="400px"
      w="90%"
      margin="auto"
      border="2px solid"
      borderColor="teal.300"
    >
      <ModalHeader>従業員追加</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack gap={3}>
          <FormControl isRequired>
            <FormLabel>従業員コード</FormLabel>
            <Input name="id" value={form.id} onChange={onChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>姓</FormLabel>
            <Input name="lastName" value={form.lastName} onChange={onChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>名</FormLabel>
            <Input
              name="firstName"
              value={form.firstName}
              onChange={onChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>付与日数</FormLabel>
            <Input
              name="total"
              type="number"
              min={0}
              value={form.total}
              onChange={onChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>消化日数</FormLabel>
            <Input
              name="used"
              type="number"
              min={0}
              value={form.used}
              onChange={onChange}
            />
          </FormControl>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="teal" mr={3} onClick={onAdd}>
          追加
        </Button>
        <Button onClick={onClose}>キャンセル</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
