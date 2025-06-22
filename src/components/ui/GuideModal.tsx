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
import { Box, Heading, Text, Button, Stack } from "@chakra-ui/react";
import { CustomModal } from "./CustomModal";

export const GuideModal: React.FC<GuideModalProps> = ({ open, onClose }) => {
  return (
    <CustomModal isOpen={open} onClose={onClose}>
      <Box maxW="600px" p={6}>
        <Heading size="md" mb={4} color="teal.700">
          有給休暇管理アプリ ソースコード学習ガイド
        </Heading>
        <Stack direction="column" align="start" gap={3} fontSize="md">
          <Text>【学習時に意識すべきポイント】</Text>
          <Text>
            - 責務分離:
            各コンポーネント・フック・ユーティリティの「役割」を意識し、どこで何を担当しているかを把握しましょう。
          </Text>
          <Text>
            - 型安全性: TypeScript
            の型定義（types.tsなど）を確認し、propsやstateの型がどのように守られているかを意識しましょう。
          </Text>
          <Text>
            - 単方向データフロー:
            props/stateの流れ（親→子、idのみ渡しデータ参照は親で一元管理）を追い、Reactの設計思想を体感しましょう。
          </Text>
          <Text>
            - UI/UX設計: Chakra
            UIやlucide-reactの使い方、バリデーション・エラーメッセージ・モーダルのUX改善ポイントを観察しましょう。
          </Text>
          <Text>
            - バリデーション共通化:
            カスタムフックやユーティリティでバリデーション処理がどのように共通化されているかを確認しましょう。
          </Text>
          <Text>
            - コメントの活用:
            各ファイル・関数・propsのコメントを読み、設計意図や流れを理解しましょう。
          </Text>
          <Text>
            - 業務ロジック:
            有給付与・消化・繰越・時効消滅など、日本法令に即したロジックがどこでどう実装されているかを意識しましょう。
          </Text>
          <Text>
            - 可読性・保守性:
            コードの分割・命名・重複排除・初学者向け配慮など、読みやすさ・直しやすさの工夫を探しましょう。
          </Text>
          <Text mt={2}>【おすすめの学習順序】</Text>
          <Text>1. App.tsx（全体像・状態管理・UI構成）</Text>
          <Text>
            2. 型定義・サンプルデータ（types.ts, sampleData/employees.ts）
          </Text>
          <Text>
            3. 主要UIコンポーネント（EmployeeTable, EmployeeModal,
            LeaveDatesModal, LeaveDateList）
          </Text>
          <Text>
            4. カスタムフック・ユーティリティ（useEmployeeForm, useLeaveDates,
            utils.ts）
          </Text>
          <Text>5. UI部品・アイコン・ガイド（icons.ts, GuideModal）</Text>
          <Text>6. 設定ファイル（package.json, tsconfig等）</Text>
          <Text mt={2}>【まとめ】</Text>
          <Text>
            「なぜこの設計なのか」「どこで何をしているか」を常に意識し、コメントを手がかりに全体像→詳細へと段階的に理解を深めましょう。
          </Text>
          <Text>
            疑問点や改善案があれば、実際に手を動かして試すことでより実践的な力が身につきます。
          </Text>
        </Stack>
        <Button mt={6} colorScheme="teal" onClick={onClose} w="100%">
          閉じる
        </Button>
      </Box>
    </CustomModal>
  );
};
