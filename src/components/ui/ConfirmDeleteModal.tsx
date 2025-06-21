import { Button, Text, HStack } from "@chakra-ui/react";
import React from "react";
import { CustomModal } from "./CustomModal";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  targetName?: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  targetName,
}) => (
  <CustomModal isOpen={isOpen} onClose={onClose}>
    <Text fontWeight="bold" fontSize="lg" mb={3} color="red.600">
      {targetName
        ? `「${targetName}」を本当に削除しますか？`
        : "本当に削除しますか？"}
    </Text>
    <Text fontSize="sm" color="gray.600" mb={5}>
      この操作は元に戻せません。
    </Text>
    <HStack justify="flex-end" gap={2}>
      <Button onClick={onClose} variant="ghost" colorScheme="teal">
        キャンセル
      </Button>
      <Button colorScheme="red" onClick={onConfirm}>
        削除する
      </Button>
    </HStack>
  </CustomModal>
);
