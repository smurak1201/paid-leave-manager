// =============================
// PageNav.tsx
// ページネーションUI部品
// =============================
//
// 役割:
// ・前へ/次へボタンでページ切り替え
//
// 設計意図:
// ・UI部品の責務分離・再利用性・可読性重視
//
// import分類:
// - React本体・フック
// - Chakra UI部品

import React from "react";
import { Box } from "@chakra-ui/react";

interface PageNavProps {
  current: number; // 現在ページ
  total: number; // 総ページ数
  onChange: (n: number) => void; // ページ変更時コールバック
}

/**
 * ページネーション部品
 * - 前へ/次へボタンでページ切り替え
 * - current/total/onChangeで状態管理
 */
export const PageNav: React.FC<PageNavProps> = ({
  current,
  total,
  onChange,
}) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    gap={2}
    mb={2}
  >
    <button
      onClick={() => onChange(Math.max(1, current - 1))}
      disabled={current === 1}
      style={{
        padding: "4px 12px",
        borderRadius: 6,
        border: "1px solid #B2F5EA",
        background: current === 1 ? "#eee" : "#fff",
        color: "black",
        cursor: current === 1 ? "not-allowed" : "pointer",
      }}
    >
      前へ
    </button>
    <span style={{ fontSize: "0.95em", color: "black" }}>
      {current} / {total}
    </span>
    <button
      onClick={() => onChange(Math.min(total, current + 1))}
      disabled={current === total}
      style={{
        padding: "4px 12px",
        borderRadius: 6,
        border: "1px solid #B2F5EA",
        background: current === total ? "#eee" : "#fff",
        color: "black",
        cursor: current === total ? "not-allowed" : "pointer",
      }}
    >
      次へ
    </button>
  </Box>
);
