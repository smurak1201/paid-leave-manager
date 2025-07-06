// =====================================================
// color-mode.tsx
// -----------------------------------------------------
// このファイルはカラーモード（ダーク/ライト）切替UI部品です。
// 主な役割:
//   - カラーモード切替ボタン・状態管理
// 設計意図:
//   - UIテーマ切替の責務分離・再利用性重視
//   - propsで状態・切替関数を受け取る
// 使い方:
//   - App.tsx等からimportして利用
// =====================================================
//
// 役割:
// ・アプリ全体のカラーモード（ダーク/ライト）切替・管理
//
// 設計意図:
// ・Chakra UI/next-themesを活用し、テーマ切替・状態管理を一元化
// ・UI部品の責務分離・型安全性強化
//
// import分類:
// - Chakra UI部品
// - next-themes
// - React本体・フック

import { useColorMode } from "@chakra-ui/system";
import { IconButton } from "@chakra-ui/react";
import { Icons } from "../employee/icons";

export function ColorModeButton(props: any) {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      onClick={toggleColorMode}
      variant="ghost"
      aria-label="カラーモード切替"
      icon={colorMode === "dark" ? <Icons.Moon /> : <Icons.Sun />}
      {...props}
    />
  );
}
