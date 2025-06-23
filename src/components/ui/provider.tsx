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

// useMemo, useCallback, useState, useEffect, useRef などを必要な箇所で活用し、リスト・コールバック・初期値計算などをメモ化・最適化する（パターンはEmployeeTable/LeaveDatesModal/EmployeeModalと同様）
