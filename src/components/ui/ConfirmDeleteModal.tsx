// =====================================================
// ConfirmDeleteModal.tsx
// -----------------------------------------------------
// 【有給休暇管理アプリ】削除確認用モーダルUI部品
// -----------------------------------------------------
// ▼主な役割
//   - 削除操作の確認・キャンセルUI
// ▼設計意図
//   - モーダルUIの責務分離・再利用性重視
//   - propsで開閉状態・確定/キャンセル関数・対象名等を受け取る
// ▼使い方
//   - 各種削除操作の共通部品として利用
// =====================================================

// ===== import: 外部ライブラリ =====
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
