// =============================
// provider.tsx
// Chakra UI/ColorModeのグローバルプロバイダ
// =============================
//
// 役割:
// ・Chakra UIのテーマ・カラーモードを全体に適用
//
// 設計意図:
// ・アプリ全体のUIテーマ・ダーク/ライト切替を一元管理
// ・UI部品の責務分離
//
// 使い方:
// <Provider>...</Provider> でアプリ全体をラップ
//
// - ColorModeProvider: カラーモード切替用
// - ChakraProvider: Chakra UIテーマ適用

"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}

// =============================
// 追加・修正時は「どこで使うか」「設計意図」を必ずコメントで明記すること！
// =============================
