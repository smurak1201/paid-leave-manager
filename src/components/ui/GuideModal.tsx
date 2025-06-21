import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { X, Edit, Trash2, Plus, Info } from "lucide-react";
import React from "react";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <Box
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
    >
      <Box
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        p={6}
        minW="340px"
        maxW="90vw"
        position="relative"
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
            <b>主な機能：</b>
            <ul style={{ marginLeft: 20 }}>
              <li>
                <Plus
                  size={16}
                  style={{ verticalAlign: "middle", marginRight: 4 }}
                />
                <b>従業員の追加：</b>{" "}
                <span style={{ color: "#319795" }}>「従業員追加」ボタン</span>
                で新規登録
              </li>
              <li>
                <Edit
                  size={16}
                  style={{ verticalAlign: "middle", marginRight: 4 }}
                />
                <b>従業員情報の編集：</b>{" "}
                <span style={{ color: "#319795" }}>
                  テーブルの
                  <Edit
                    size={14}
                    style={{ verticalAlign: "middle", margin: "0 2px" }}
                  />
                  編集ボタン
                </span>
                で編集
              </li>
              <li>
                <Trash2
                  size={16}
                  style={{ verticalAlign: "middle", marginRight: 4 }}
                />
                <b>従業員の削除：</b>{" "}
                <span style={{ color: "#E53E3E" }}>
                  テーブルの
                  <Trash2
                    size={14}
                    style={{ verticalAlign: "middle", margin: "0 2px" }}
                  />
                  削除ボタン
                </span>
                で削除
              </li>
              <li>
                <Edit
                  size={16}
                  style={{ verticalAlign: "middle", marginRight: 4 }}
                />
                <b>有給取得日の登録・編集：</b>{" "}
                <span style={{ color: "#319795" }}>
                  「確認」ボタンから日付を
                  <Plus
                    size={14}
                    style={{ verticalAlign: "middle", margin: "0 2px" }}
                  />
                  追加、
                  <Edit
                    size={14}
                    style={{ verticalAlign: "middle", margin: "0 2px" }}
                  />
                  編集、
                  <Trash2
                    size={14}
                    style={{ verticalAlign: "middle", margin: "0 2px" }}
                  />
                  削除
                </span>
              </li>
            </ul>
          </Text>
          <Text mb={2}>
            <b>使い方：</b>
            <ul style={{ marginLeft: 20 }}>
              <li>
                <Plus
                  size={14}
                  style={{ verticalAlign: "middle", margin: "0 2px" }}
                />
                「従業員追加」ボタンで新規従業員を登録
              </li>
              <li>
                <Edit
                  size={14}
                  style={{ verticalAlign: "middle", margin: "0 2px" }}
                />
                テーブルの編集ボタンで従業員情報を編集
              </li>
              <li>
                <Trash2
                  size={14}
                  style={{ verticalAlign: "middle", margin: "0 2px" }}
                />
                テーブルの削除ボタンで従業員を削除
              </li>
              <li>
                <span style={{ color: "#319795" }}>「確認」ボタン</span>
                で有給取得日を一覧・編集
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
