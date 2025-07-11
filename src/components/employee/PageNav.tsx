// =====================================================
// PageNav.tsx
// -----------------------------------------------------
// 【有給休暇管理アプリ】ページネーションUI部品
// -----------------------------------------------------
// ▼主な役割
//   - 一覧画面等のページ切替UI（前へ/次へボタン）
// ▼設計意図
//   - ページネーションUIの責務分離・再利用性重視
//   - propsで必要なデータ・関数のみ受け取り、状態は持たない
// ▼使い方
//   - 一覧系コンポーネントからpropsで利用
// =====================================================

// ===== import: 外部ライブラリ =====
import React from "react";
import { Box } from "@chakra-ui/react";

// ===============================
// ▼props型定義
// ===============================
interface PageNavProps {
  current: number; // 現在ページ番号
  total: number; // 総ページ数
  onChange: (n: number) => void; // ページ変更時コールバック
}

// ===============================
// ▼UI描画
// ===============================
// ポイント: current/total/onChangeのみで状態管理し、UI責務に特化
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
