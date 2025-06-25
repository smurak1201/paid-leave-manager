// =============================
// ConfirmDeleteModal.tsx
// 削除確認用モーダルUI部品
// =============================
//
// 役割:
// ・削除操作時の確認ダイアログ表示
//
// 設計意図:
// ・誤操作防止・UI/UX向上・責務分離
//
// import分類:
// - Chakra UI部品
// - React本体・フック
// - カスタムモーダル

import { Button, Text, HStack, Box } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { CustomModal } from "./CustomModal";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  targetName?: string;
  extraMessage?: string; // 追加: 補足説明文
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  targetName,
  extraMessage,
}) => {
  const modalTitle = useMemo(
    () =>
      targetName
        ? `「${targetName}」を本当に削除しますか？`
        : "本当に削除しますか？",
    [targetName]
  );

  const modalContent = useMemo(() => "この操作は元に戻せません。", []);

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <Box
        bg="white"
        p={6}
        borderRadius="md"
        boxShadow="lg"
        minW={{ base: "90vw", sm: "360px" }}
        maxW="96vw"
        maxH="90vh"
        overflowY="auto"
      >
        <Text fontWeight="bold" fontSize="lg" mb={3} color="red.600">
          {modalTitle}
        </Text>
        <Text fontSize="sm" color="gray.600" mb={2}>
          {modalContent}
        </Text>
        {extraMessage && (
          <Text fontSize="sm" color="red.500" mb={4}>
            {extraMessage}
          </Text>
        )}
        <HStack justify="flex-end" gap={2}>
          <Button onClick={onClose} variant="ghost" colorScheme="teal">
            キャンセル
          </Button>
          <Button colorScheme="red" onClick={onConfirm}>
            削除する
          </Button>
        </HStack>
      </Box>
    </CustomModal>
  );
};
