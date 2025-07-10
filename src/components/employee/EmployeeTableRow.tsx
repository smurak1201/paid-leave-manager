// =====================================================
// EmployeeTableRow.tsx
// -----------------------------------------------------
// このファイルは従業員一覧テーブルの1行を表示するコンポーネントです。
// 主な役割:
//   - 従業員ごとの情報（ID/氏名/入社日/残日数など）を1行で表示
//   - 操作ボタン（確認・編集・削除）を提供
// 設計意図:
//   - テーブルの1行ごとに責務を分離し、再利用性・可読性を高める
//   - propsで必要な情報・操作関数のみ受け取り、状態は持たない純粋な表示部品
// 使い方:
//   - EmployeeTableからpropsでデータ・操作関数を受け取る
// =====================================================

// =============================
// 従業員一覧テーブルの1行を表示するコンポーネント
// =============================
//
// 役割:
// ・従業員ごとの情報（ID/氏名/入社日/残日数など）を1行で表示
// ・操作ボタン（確認・編集・削除）を提供
// ・奇数行色分けや残日数0の強調など、UIの分かりやすさを重視
//
// 設計意図:
// ・テーブルの1行ごとに責務を分離し、再利用性・可読性を高める
// ・propsで必要な情報・操作関数のみ受け取り、状態は持たない純粋な表示部品

// ===== import: React本体 =====
import React from "react";
// ===== import: Chakra UI（テーブル・UI部品） =====
import { Td, Tr } from "@chakra-ui/table";
import { Badge, HStack, IconButton, Icon } from "@chakra-ui/react";
// ===== import: アイコン・カスタムUI部品 =====
import { Icons } from "./icons";
import { Tooltip } from "../ui/tooltip";
// ===== import: 型定義 =====
import type { RowContentProps } from "./types";

export const EmployeeTableRow: React.FC<
  RowContentProps & { rowIndex?: number }
> = function EmployeeTableRow(props) {
  // propsから各従業員のデータや操作関数を受け取る
  const {
    emp, // 従業員データ（ID・氏名・入社日など）
    grantThisYear, // 今年度付与日数
    carryOver, // 繰越日数
    used, // 消化日数
    remain, // 残日数
    servicePeriod, // 勤続年数（xx年xxか月）
    onView, // 詳細確認ボタンのハンドラ
    onEdit, // 編集ボタンのハンドラ
    handleDeleteClick, // 削除ボタンのハンドラ
    rowIndex, // 行インデックス（奇数行色分け用）
  } = props;

  // 入社年月日を「YYYY年M月D日」形式に変換
  const [y, m, d] = emp.joinedAt.split("-");
  const joinedAtJp = `${y}年${Number(m)}月${d ? Number(d) + "日" : ""}`;

  // 行の背景色を決定
  // ・残日数0なら薄い赤色
  // ・奇数行ならteal系の薄い色
  let rowBg = undefined;
  if (remain === 0) {
    rowBg = "#FFF5F5";
  } else if (typeof rowIndex === "number" && rowIndex % 2 === 1) {
    rowBg = "rgba(0,128,128,0.06)";
  }

  // テーブル行の描画
  return (
    <Tr bg={rowBg} transition="background 0.3s">
      {/* 従業員コード（業務用ID） */}
      <Td fontWeight="bold" color="teal.700" fontSize="md">
        {emp.employeeId}
      </Td>
      {/* 姓・名 */}
      <Td color="gray.700">{emp.lastName}</Td>
      <Td color="gray.700">{emp.firstName}</Td>
      {/* 入社年月日・勤続年数 */}
      <Td color="gray.600">{joinedAtJp}</Td>
      <Td color="gray.600">{servicePeriod}</Td>
      {/* 今年度付与・繰越・消化日数 */}
      <Td isNumeric color="teal.700">
        {grantThisYear}
      </Td>
      <Td isNumeric color="teal.700">
        {carryOver}
      </Td>
      <Td isNumeric color="teal.700">
        {used}
      </Td>
      {/* 残日数（色分けバッジ） */}
      <Td isNumeric>
        <Badge
          colorScheme={remain <= 3 ? "red" : remain <= 7 ? "yellow" : "teal"}
          fontSize="md"
          px={3}
          py={1}
          borderRadius="md"
          fontWeight="bold"
          minW="3em"
          textAlign="center"
          boxShadow="sm"
        >
          {remain}
        </Badge>
      </Td>
      {/* 操作ボタン（確認・編集・削除） */}
      <Td>
        <HStack justify="center" gap={1}>
          <Tooltip content="確認" showArrow>
            <IconButton
              aria-label="確認"
              size="sm"
              variant="ghost"
              colorScheme="blue"
              onClick={() => onView(emp.employeeId)}
            >
              <Icon as={Icons.Eye} boxSize={5} />
            </IconButton>
          </Tooltip>
          <Tooltip content="編集" showArrow>
            <IconButton
              aria-label="編集"
              size="sm"
              variant="ghost"
              colorScheme="teal"
              onClick={() => onEdit(emp.employeeId)}
              disabled={props.isReadOnly}
              style={{
                cursor: props.isReadOnly ? "not-allowed" : undefined,
                opacity: props.isReadOnly ? 0.5 : 1,
              }}
            >
              <Icon as={Icons.Edit} boxSize={5} />
            </IconButton>
          </Tooltip>
          <Tooltip content="削除" showArrow>
            <IconButton
              aria-label="削除"
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={() => handleDeleteClick(emp.employeeId)}
              disabled={props.isReadOnly}
              style={{
                cursor: props.isReadOnly ? "not-allowed" : undefined,
                opacity: props.isReadOnly ? 0.5 : 1,
              }}
            >
              <Icon as={Icons.Trash2} boxSize={5} />
            </IconButton>
          </Tooltip>
        </HStack>
      </Td>
    </Tr>
  );
};
