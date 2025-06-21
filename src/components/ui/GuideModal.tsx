import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { X, Edit, Trash2, Plus, Info, Eye } from "lucide-react";
import React from "react";

interface GuideModalProps {
  open: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ open, onClose }) => {
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };
  if (!open) return null;
  return (
    <Box
      ref={overlayRef}
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      zIndex={2100}
      bg="blackAlpha.400"
      display="flex"
      alignItems="center"
      justifyContent="center"
      onClick={handleOverlayClick}
    >
      <Box
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        p={6}
        minW="340px"
        maxW="90vw"
        position="relative"
        maxHeight="80vh"
        overflowY="auto"
        onClick={(e) => e.stopPropagation()}
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
        >
          <X size={18} />
        </Button>
        <Heading as="h3" size="md" mb={4} color="teal.700" textAlign="center">
          有給休暇管理ガイド
        </Heading>
        <Box color="gray.700" fontSize="md" lineHeight={1.8}>
          <Text mb={2}>
            このアプリは、従業員ごとの有給休暇の付与日数・取得状況・残日数を一元管理できます。
          </Text>
          <Text mb={2}>
            <b>付与日数と繰越日数について：</b>
            <br />
            ・毎年の付与日数は勤続年数に応じて決まります。
            <br />
            ・未消化分は翌年に繰り越されますが、繰越できるのは最大2年分までです。
            <br />
            ・2年以上前の有給は自動的に消滅します。
            <br />
            <br />
            <b>【例】</b>
            <br />
            <span style={{ fontSize: "0.95em" }}>
              2022年度: 12日付与 → 2日消化 → 10日繰越
              <br />
              2023年度: 14日付与 → 1日消化 → 13日繰越
              <br />
              2024年度: 16日付与 → 未消化
              <br />
              <b>
                → 2024年度の有効日数:
                10日（2022繰越）+13日（2023繰越）+16日（2024付与）=39日
              </b>
              <br />
              ただし2022年度分は2025年度には時効消滅します。
            </span>
          </Text>
          <Box mb={2}>
            <Heading as="h4" size="sm" color="teal.600" mb={1}>
              付与日数・繰越日数のサンプル表
            </Heading>
            <Box as="table" w="100%" borderCollapse="collapse" fontSize="sm">
              <Box as="thead" bg="teal.50">
                <Box as="tr">
                  <Box
                    as="th"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    年度
                  </Box>
                  <Box
                    as="th"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    付与日数
                  </Box>
                  <Box
                    as="th"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    消化日数
                  </Box>
                  <Box
                    as="th"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    繰越日数
                  </Box>
                  <Box
                    as="th"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    有効期限
                  </Box>
                </Box>
              </Box>
              <Box as="tbody">
                <Box as="tr">
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    2022年度
                  </Box>
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    12
                  </Box>
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    2
                  </Box>
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    10
                  </Box>
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    2024年度末まで
                  </Box>
                </Box>
                <Box as="tr">
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    2023年度
                  </Box>
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    14
                  </Box>
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    1
                  </Box>
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    13
                  </Box>
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    2025年度末まで
                  </Box>
                </Box>
                <Box as="tr">
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    2024年度
                  </Box>
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    16
                  </Box>
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    0
                  </Box>
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    16
                  </Box>
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    2026年度末まで
                  </Box>
                </Box>
              </Box>
            </Box>
            <Text color="gray.500" fontSize="xs">
              ※繰越は最大2年分まで。2年以上前の分は自動消滅します。
            </Text>
          </Box>
          <Text mb={2}>
            <b>主な機能：</b>
            <ul style={{ marginLeft: 20 }}>
              <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Plus size={16} />
                <span>従業員の追加・管理</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Edit size={16} />
                <span>従業員情報の編集</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Trash2 size={16} />
                <span>従業員の削除</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Edit size={16} />
                <span>有給取得日の登録・編集・削除</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span>残日数の自動計算</span>
              </li>
            </ul>
          </Text>
          <Text mb={2}>
            <b>使い方：</b>
            <ul style={{ marginLeft: 20 }}>
              <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Plus size={14} />
                <span>「従業員追加」ボタンで新規従業員を登録</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Edit size={14} />
                <span>テーブルの編集ボタンで従業員情報を編集</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Trash2 size={14} />
                <span>テーブルの削除ボタンで従業員を削除</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Eye size={14} />
                <span>テーブルの確認ボタンで有給取得日を一覧・編集</span>
              </li>
            </ul>
          </Text>
          <Text mb={2}>
            <b>日本の有給休暇制度（概要）</b>
            <br />
            ・年次有給休暇は、雇用形態や勤続年数に応じて付与されます。
            <br />
            ・取得日数や残日数の管理が義務化されています。
            <br />
            ・本アプリはその管理をサポートします。
          </Text>
          <Box mt={4}>
            <Heading as="h4" size="sm" color="teal.600" mb={2}>
              年次有給休暇 付与日数の目安表
            </Heading>
            <Box
              as="table"
              w="100%"
              borderCollapse="collapse"
              fontSize="sm"
              mb={2}
            >
              <Box as="thead" bg="teal.50">
                <Box as="tr">
                  <Box
                    as="th"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    勤続年数
                  </Box>
                  <Box
                    as="th"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    付与日数
                  </Box>
                </Box>
              </Box>
              <Box as="tbody">
                <Box as="tr">
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    6か月
                  </Box>
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    10日
                  </Box>
                </Box>
                <Box as="tr">
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    1年6か月
                  </Box>
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    11日
                  </Box>
                </Box>
                <Box as="tr">
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    2年6か月
                  </Box>
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    12日
                  </Box>
                </Box>
                <Box as="tr">
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    3年6か月
                  </Box>
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    14日
                  </Box>
                </Box>
                <Box as="tr">
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    4年6か月
                  </Box>
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    16日
                  </Box>
                </Box>
                <Box as="tr">
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    5年6か月
                  </Box>
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    18日
                  </Box>
                </Box>
                <Box as="tr">
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    6年6か月以上
                  </Box>
                  <Box
                    as="td"
                    border="1px solid #B2F5EA"
                    p={1}
                    textAlign="center"
                  >
                    20日
                  </Box>
                </Box>
              </Box>
            </Box>
            <Text color="gray.500" fontSize="xs">
              ※週所定労働日数や労働時間によって異なる場合があります
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
