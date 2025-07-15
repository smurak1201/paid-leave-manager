// =====================================================
// provider.tsx
// -----------------------------------------------------
// 【有給休暇管理アプリ】Chakra UI等のグローバルプロバイダ設定
// -----------------------------------------------------
// ▼主な役割
//   - テーマ・グローバルUI設定の提供
// ▼設計意図
//   - アプリ全体のUI/テーマ設定の一元化
// ▼使い方
//   - main.tsx等でimportして全体に適用
// =====================================================

// ===== import: 外部ライブラリ =====
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
("use client");

/**
 * Provider
 * - ChakraProviderで全体ラップ
 */
export function Provider({ children }: { children: React.ReactNode }) {
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>;
}

// useMemo, useCallback, useState, useEffect, useRef などを必要な箇所で活用し、
// リスト・コールバック・初期値計算などをメモ化・最適化する
// （パターンはEmployeeTable/LeaveDatesModal/EmployeeModalと同様）
