// =====================================================
// GuideModal.tsx
// -----------------------------------------------------
// 【有給休暇管理アプリ】学習ガイド・使い方説明用モーダルUI
// -----------------------------------------------------
// ▼主な役割
//   - アプリの使い方・設計方針・学習ポイントの表示
// ▼設計意図
//   - 学習用途・ヘルプUIの責務分離・再利用性重視
//   - propsで開閉状態・クローズ関数を受け取る
// ▼使い方
//   - App.tsx等からpropsでopen/onCloseを渡して利用
// =====================================================

// ===== import: 外部ライブラリ・UI部品 =====
import { Box, Heading, Text, Stack, Icon } from "@chakra-ui/react";
import { CustomModal } from "./CustomModal";
import { Icons } from "../employee/icons";

// セクションタイトル用共通props
const sectionTitleProps = { fontWeight: "bold", mt: 4, mb: 1 };

const tableData = [
  {
    year: "2022年度",
    grant: 12,
    used: 2,
    carryOver: 10,
    validUntil: "2024年度末",
  },
  {
    year: "2023年度",
    grant: 14,
    used: 1,
    carryOver: 13,
    validUntil: "2025年度末",
  },
  {
    year: "2024年度",
    grant: 16,
    used: 0,
    carryOver: 0,
    validUntil: "2026年度末",
  },
];
const guidelineData = [
  { tenure: "6か月", grant: 10 },
  { tenure: "1年6か月", grant: 11 },
  { tenure: "2年6か月", grant: 12 },
  { tenure: "3年6か月", grant: 14 },
  { tenure: "4年6か月", grant: 16 },
  { tenure: "5年6か月", grant: 18 },
  { tenure: "6年6か月以上", grant: 20 },
];

export const GuideModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
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
        <button
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            zIndex: 1,
          }}
          onClick={onClose}
          aria-label="閉じる"
        >
          <Icon as={Icons.X} boxSize={4} />
        </button>
        <Heading size="md" mb={4} color="teal.700">
          有給休暇管理ガイド
        </Heading>
        <Stack direction="column" align="start" gap={3} fontSize="md">
          <Text>
            このアプリは、従業員ごとの有給休暇の付与日数・取得状況・残日数を一元管理できます。
          </Text>
          <Text>
            管理者以外は閲覧のみ可能です。従業員の追加・編集・削除は管理者のみが行えます。
          </Text>
          <Text {...sectionTitleProps}>付与日数と繰越日数について：</Text>
          <Text as="ul" pl={5} mb={2}>
            <Text as="li">毎年の付与日数は勤続年数に応じて決まります。</Text>
            <Text as="li">
              未消化分は翌年に繰り越されますが、繰越できるのは最大2年分までです。
            </Text>
            <Text as="li" color="teal.700" fontWeight="bold">
              ※繰越日数は最大20日までです（法令上の上限）。
            </Text>
            <Text as="li">
              2年以上前の有給は自動的に消滅し、消滅した分は繰り越されません。
            </Text>
            <Text as="li">
              有給を消化する際は、繰越分・今年度分を問わず「古い付与分から順に消化」されます（法令順守）。
            </Text>
            <Text as="li">
              残日数の計算は、2年以内の有効な付与分のみを対象に、消化済み日数を差し引いて算出しています。
            </Text>
            <Text as="li">
              これらのロジックは日本の労働基準法・厚生労働省ガイドラインに準拠しています。
            </Text>
          </Text>
          <Text {...sectionTitleProps}>【例】</Text>
          <Box
            as="pre"
            fontSize="sm"
            bg="gray.50"
            p={2}
            borderRadius="md"
            w="100%"
            whiteSpace="pre-wrap"
          >
            {`2022年度: 12日付与 → 2日消化 → 10日繰越\n2023年度: 14日付与 → 1日消化 → 13日繰越\n2024年度: 16日付与 → 未消化\n※2022年度分は2024年度末で自動消滅`}
          </Box>
          <Text {...sectionTitleProps}>付与日数・繰越日数のサンプル表</Text>
          <Box overflowX="auto" w="100%" pl={2} mb={2}>
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
                {tableData.map((row) => (
                  <tr key={row.year}>
                    <td
                      style={{
                        border: "1px solid #b2f5ea",
                        padding: 4,
                        textAlign: "center",
                      }}
                    >
                      {row.year}
                    </td>
                    <td
                      style={{
                        border: "1px solid #b2f5ea",
                        padding: 4,
                        textAlign: "center",
                      }}
                    >
                      {row.grant}
                    </td>
                    <td
                      style={{
                        border: "1px solid #b2f5ea",
                        padding: 4,
                        textAlign: "center",
                      }}
                    >
                      {row.used}
                    </td>
                    <td
                      style={{
                        border: "1px solid #b2f5ea",
                        padding: 4,
                        textAlign: "center",
                      }}
                    >
                      {row.carryOver}
                    </td>
                    <td
                      style={{
                        border: "1px solid #b2f5ea",
                        padding: 4,
                        textAlign: "center",
                      }}
                    >
                      {row.validUntil}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Text fontSize="xs" color="gray.500" mt={1}>
              ※繰越は最大2年分まで。2年以上前の分は自動消滅します。
            </Text>
          </Box>
          <Text {...sectionTitleProps}>主な機能：</Text>
          <Text as="ul" pl={5} mb={2}>
            <Text as="li">従業員の追加・管理</Text>
            <Text as="li">従業員情報の編集</Text>
            <Text as="li">従業員の削除</Text>
            <Text as="li">有給取得日の登録・編集・削除</Text>
            <Text as="li">残日数の自動計算</Text>
          </Text>
          <Text {...sectionTitleProps}>使い方：</Text>
          <Text as="ul" pl={5} mb={2}>
            <Text as="li">「従業員追加」ボタンで新規従業員を登録</Text>
            <Text as="li">
              <Icon as={Icons.Edit} boxSize={4} mr={1} />
              編集ボタンで従業員情報を編集
            </Text>
            <Text as="li">
              <Icon as={Icons.Trash2} boxSize={4} mr={1} />
              削除ボタンで従業員を削除
            </Text>
            <Text as="li">
              <Icon as={Icons.Eye} boxSize={4} mr={1} />
              確認ボタンで有給取得日を一覧・編集
            </Text>
          </Text>
          <Text {...sectionTitleProps}>日本の有給休暇制度（概要）</Text>
          <Text as="ul" pl={5} mb={2}>
            <Text as="li">
              年次有給休暇は、雇用形態や勤続年数に応じて付与されます。
            </Text>
            <Text as="li">取得日数や残日数の管理が義務化されています。</Text>
            <Text as="li">本アプリはその管理をサポートします。</Text>
          </Text>
          <Text {...sectionTitleProps}>年次有給休暇 付与日数の目安表</Text>
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
                {guidelineData.map((row) => (
                  <tr key={row.tenure}>
                    <td
                      style={{
                        border: "1px solid #b2f5ea",
                        padding: 4,
                        textAlign: "center",
                      }}
                    >
                      {row.tenure}
                    </td>
                    <td
                      style={{
                        border: "1px solid #b2f5ea",
                        padding: 4,
                        textAlign: "center",
                      }}
                    >
                      {row.grant}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Text fontSize="xs" color="gray.500" mt={1}>
              ※この表は「週5日・年間217日以上勤務する通常のフルタイム労働者（正社員等）」の場合の目安です。パートタイムや週所定労働日数が少ない場合は付与日数が異なります。
            </Text>
            <Text fontSize="xs" color="gray.400" mt={0}>
              （参考：労働基準法第39条・厚生労働省ガイドライン）
            </Text>
          </Box>
          <Text {...sectionTitleProps}>
            本アプリで対応している日本の有給休暇制度ロジック：
          </Text>
          <Text as="ul" pl={5} mb={2}>
            <Text as="li">
              勤続年数に応じた付与日数の自動計算（正社員モデル）
            </Text>
            <Text as="li">付与日ごとに2年の有効期限管理</Text>
            <Text as="li">前回付与分の残日数（最大20日）を繰越</Text>
            <Text as="li">最大保有日数40日（付与＋繰越の合計）</Text>
            <Text as="li">FIFO（先入れ先出し）消化順序</Text>
            <Text as="li">有効期限切れ分の自動失効</Text>
            <Text as="li">日単位での有給取得・管理</Text>
          </Text>
          <Text {...sectionTitleProps}>
            未対応・追加実装が必要な主なロジック：
          </Text>
          <Text as="ul" pl={5} mb={2}>
            <Text as="li">年5日取得義務（2019年法改正）</Text>
            <Text as="li">出勤率8割判定による付与可否</Text>
            <Text as="li">雇用形態別付与（パート・短時間労働者等）</Text>
            <Text as="li">時間単位・半日単位有給</Text>
            <Text as="li">付与基準日（入社日以外の基準日管理）</Text>
            <Text as="li">失効日数の明示・管理</Text>
            <Text as="li">特別休暇・その他休暇との区別</Text>
          </Text>
        </Stack>
      </Box>
    </CustomModal>
  );
};
// 不要なローカルロジックや未使用変数はなし。props/stateの流れ・責務分離は現状で最適化済み。
