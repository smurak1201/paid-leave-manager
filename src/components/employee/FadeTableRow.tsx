// =============================
// FadeTableRow.tsx
// テーブル行のフェードアニメーション用小コンポーネント
// =============================
//
// このファイルはテーブル行のアニメーション表示を担う小UI部品です。
// - propsとしてchildren・アニメーション制御用propsを受け取る
// - UI部品の小コンポーネント化・責務分離
//
// 設計意図:
// - アニメーションの責務を分離し、テーブル本体の可読性・保守性を向上
// - 初学者でも理解しやすいように全体の流れ・propsの意味を日本語コメントで明記
//
// 使い方:
// - テーブルの行を表現するtrタグに相当する部分でFadeTableRowを使用
// - childrenにテーブルデータを配置
// - 必要に応じてinPropでアニメーションのオンオフを制御
//
// 例:
// <FadeTableRow inProp={true}>
//   <td>データ1</td>
//   <td>データ2</td>
// </FadeTableRow>
//
// 注意点:
// - framer-motionパッケージが必要
// - モーションの設定はこのコンポーネント内で完結
// - テーブルの構造に応じて適切に使用
//
// =============================

/// framer-motionを使い、行の追加・削除時に自然なフェード効果を付与します。
import React from "react";
import { motion } from "framer-motion";

const MotionTr = motion.tr;

export const FadeTableRow: React.FC<
  React.ComponentPropsWithoutRef<"tr"> & { inProp?: boolean }
> = ({
  inProp = true,
  children,
  onAnimationStart,
  onDragStart,
  onDragEnd,
  onDrag,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  ...rest
}) => {
  return (
    <MotionTr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      {...rest}
    >
      {children}
    </MotionTr>
  );
};
