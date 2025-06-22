// =============================
// GuideModal.tsx
// アプリの使い方ガイドモーダル
// =============================
//
// 役割:
// ・アプリの使い方・業務ロジックの説明を表示
//
// 設計意図:
// ・UI部品の責務分離・可読性向上

// ===== import: 型定義 =====
import type { GuideModalProps } from "../employee/types";
// ===== import: 外部ライブラリ・UI部品 =====
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { CustomModal } from "./CustomModal";
import { Icons } from "../employee/icons";

export const GuideModal: React.FC<GuideModalProps> = ({ open, onClose }) => {
  return (
    <CustomModal isOpen={open} onClose={onClose}>
      <Box maxW="600px" p={6} position="relative">
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
          <Icon as={Icons.X} boxSize={4} />
        </Button>
        <Heading size="md" mb={4} color="teal.700">
          有給休暇管理アプリの使い方
        </Heading>
        <Stack direction="column" align="start" gap={3} fontSize="md">
          <Text>【主な機能】</Text>
          <HStack>
            <Icon as={Icons.Plus} color="teal.500" boxSize={5} />
            <Text as="span">従業員の追加</Text>
          </HStack>
          <HStack>
            <Icon as={Icons.Edit} color="teal.500" boxSize={5} />
            <Text as="span">従業員情報の編集</Text>
          </HStack>
          <HStack>
            <Icon as={Icons.Trash2} color="teal.500" boxSize={5} />
            <Text as="span">従業員の削除</Text>
          </HStack>
          <HStack>
            <Icon as={Icons.Eye} color="teal.500" boxSize={5} />
            <Text as="span">従業員ごとの有給取得日一覧・編集</Text>
          </HStack>
          <Text>・従業員コードは半角数字で重複不可です。</Text>
          <Text>
            ・入社年月日を入力すると自動で有給付与日数が計算されます。
          </Text>
          <Text>・有給休暇の残日数や消化状況も自動で集計されます。</Text>
          <Text>・バリデーションエラーは即時表示されます。</Text>
          <Text>・各操作はテーブルやボタンから直感的に行えます。</Text>
          <Text mt={2}>【有給休暇の基礎】</Text>
          <Text>
            ・有給休暇は入社半年後に10日付与され、以降は勤続年数に応じて増加します。
          </Text>
          <Text>
            ・有給の取得・消化・繰越・時効消滅など日本の法令に準拠したロジックです。
          </Text>
        </Stack>
      </Box>
    </CustomModal>
  );
};
