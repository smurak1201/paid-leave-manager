// =====================================================
// provider.tsx
// -----------------------------------------------------
// このファイルはChakra UI等のグローバルプロバイダ設定です。
// 主な役割:
//   - テーマ・グローバルUI設定の提供
// 設計意図:
//   - アプリ全体のUI/テーマ設定の一元化
// 使い方:
//   - main.tsx等でimportして全体に適用
// =====================================================
//
// 役割:
// ・Chakra UIのテーマ・カラーモードを全体に適用
//
// 設計意図:
// ・アプリ全体のUIテーマ・ダーク/ライト切替を一元管理
// ・UI部品の責務分離
//
// import分類:
// - Chakra UI部品
// - ColorModeProvider

"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

/**
 * Provider
 * - ChakraProvider/ColorModeProviderで全体ラップ
 */
export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}

// useMemo, useCallback, useState, useEffect, useRef などを必要な箇所で活用し、リスト・コールバック・初期値計算などをメモ化・最適化する（パターンはEmployeeTable/LeaveDatesModal/EmployeeModalと同様）
