// =============================
// GuideModal.tsx
// アプリの使い方ガイドモーダル
// =============================
//
// 役割:
// ・アプリの使い方・業務ロジックの説明を表示
//
// 設計意図:
// ・UI部品の責務分離・可読性向上

// ===== import: 型定義 =====
import type { GuideModalProps } from "../employee/types";

// props型はtypes.tsで一元管理
export const GuideModal: React.FC<GuideModalProps> = ({ open }) => {
  if (!open) return null;
  // ...既存のモーダルUI描画...
  // ...existing code...
};
