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
import { Box, Heading, Text, Button, Stack, Icon } from "@chakra-ui/react";
import { CustomModal } from "./CustomModal";
import { Icons } from "../employee/icons";

export const GuideModal: React.FC<GuideModalProps> = ({ open, onClose }) => {
  return (
    <CustomModal isOpen={open} onClose={onClose}>
      <Box
        position="relative"
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        maxH="80vh"
        overflowY="auto"
        p={8}
        minW="360px"
        maxW="900px"
        w="90vw"
      >
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
          zIndex={1}
        >
          <Icon as={Icons.X} boxSize={4} />
        </Button>
        <Heading size="md" mb={4} color="teal.700">
          有給休暇管理ガイド
        </Heading>
        <Stack direction="column" align="start" gap={3} fontSize="md">
          <Text>
            このアプリは、従業員ごとの有給休暇の付与日数・取得状況・残日数を一元管理できます。
          </Text>
          <Text fontWeight="bold" mt={2}>
            付与日数と繰越日数について：
          </Text>
          <Text>・毎年の付与日数は勤続年数に応じて決まります。</Text>
          <Text>
            ・未消化分は翌年に繰り越されますが、繰越できるのは最大2年分までです。
          </Text>
          <Text>
            ・2年以上前の有給は自動的に消滅し、消滅した分は繰り越されません。
          </Text>
          <Text>
            ・有給を消化する際は、繰越分・今年度分を問わず「古い付与分から順に消化」されます（法令順守）。
          </Text>
          <Text>
            ・残日数の計算は、2年以内の有効な付与分のみを対象に、消化済み日数を差し引いて算出しています。
          </Text>
          <Text>
            ・これらのロジックは日本の労働基準法・厚生労働省ガイドラインに準拠しています。
          </Text>
          <Text fontWeight="bold" mt={4}>
            【例】
          </Text>
          <Box
            as="pre"
            fontSize="sm"
            bg="gray.50"
            p={2}
            borderRadius="md"
            w="100%"
            whiteSpace="pre-wrap"
          >
            {`2022年度: 12日付与 → 2日消化 → 10日繰越
2023年度: 14日付与 → 1日消化 → 13日繰越
2024年度: 16日付与 → 未消化
※2022年度分は2024年度末で自動消滅`}
          </Box>
          <Text fontWeight="bold" mt={4}>
            付与日数・繰越日数のサンプル表
          </Text>
          <Box overflowX="auto" w="100%" pl={2}>
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                minWidth: 400,
              }}
            >
              <thead>
                <tr style={{ background: "#e6fffa" }}>
                  <th
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    年度
                  </th>
                  <th
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    付与日数
                  </th>
                  <th
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    消化日数
                  </th>
                  <th
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    繰越日数
                  </th>
                  <th
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    有効期限
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    2022年度
                  </td>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    12
                  </td>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    2
                  </td>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    10
                  </td>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    2024年度末まで
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    2023年度
                  </td>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    14
                  </td>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    1
                  </td>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    13
                  </td>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    2025年度末まで
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    2024年度
                  </td>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    16
                  </td>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    0
                  </td>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    16
                  </td>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    2026年度末まで
                  </td>
                </tr>
              </tbody>
            </table>
            <Text fontSize="xs" color="gray.500" mt={1}>
              ※繰越は最大2年分まで。2年以上前の分は自動消滅します。
            </Text>
          </Box>
          <Text fontWeight="bold" mt={4}>
            主な機能：
          </Text>
          <Text>・従業員の追加・管理</Text>
          <Text>・従業員情報の編集</Text>
          <Text>・従業員の削除</Text>
          <Text>・有給取得日の登録・編集・削除</Text>
          <Text>・残日数の自動計算</Text>
          <Text fontWeight="bold" mt={4}>
            使い方：
          </Text>
          <Text>「従業員追加」ボタンで新規従業員を登録</Text>
          <Text>テーブルの編集ボタンで従業員情報を編集</Text>
          <Text>テーブルの削除ボタンで従業員を削除</Text>
          <Text>テーブルの確認ボタンで有給取得日を一覧・編集</Text>
          <Text fontWeight="bold" mt={4}>
            日本の有給休暇制度（概要）
          </Text>
          <Text>
            ・年次有給休暇は、雇用形態や勤続年数に応じて付与されます。
          </Text>
          <Text>・取得日数や残日数の管理が義務化されています。</Text>
          <Text>・本アプリはその管理をサポートします。</Text>
          <Text fontWeight="bold" mt={4}>
            年次有給休暇 付与日数の目安表
          </Text>
          <Box overflowX="auto" w="100%" pl={2}>
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                minWidth: 320,
              }}
            >
              <thead>
                <tr style={{ background: "#e6fffa" }}>
                  <th
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    勤続年数
                  </th>
                  <th
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    付与日数
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    6か月
                  </td>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    10日
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    1年6か月
                  </td>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    11日
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    2年6か月
                  </td>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    12日
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    3年6か月
                  </td>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    14日
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    4年6か月
                  </td>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    16日
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    5年6か月
                  </td>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    18日
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    6年6か月以上
                  </td>
                  <td
                    style={{
                      border: "1px solid #b2f5ea",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    20日
                  </td>
                </tr>
              </tbody>
            </table>
            <Text fontSize="xs" color="gray.500" mt={1}>
              ※週所定労働日数や労働時間によって異なる場合があります
            </Text>
          </Box>
        </Stack>
      </Box>
    </CustomModal>
  );
};
