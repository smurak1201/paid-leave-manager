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
// 使い方:
// <ConfirmDeleteModal isOpen={...} onClose={...} onConfirm={...} targetName={...} />
//
// - isOpen: モーダル表示状態
// - onClose: 閉じる処理
// - onConfirm: 削除確定処理
// - targetName: 削除対象名（任意）

import { Button, Text, HStack, Box } from "@chakra-ui/react";
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
    </Box>
  </CustomModal>
);

// =============================
// 追加・修正時は「どこで使うか」「設計意図」を必ずコメントで明記すること！
// =============================
