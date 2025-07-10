// =====================================================
// CustomModal.tsx
// -----------------------------------------------------
// 【有給休暇管理アプリ】汎用カスタムモーダルUI部品
// -----------------------------------------------------
// ▼主な役割
//   - 任意の内容を表示できるモーダルUI
// ▼設計意図
//   - モーダルUIの責務分離・再利用性重視
//   - propsで開閉状態・内容・クローズ関数を受け取る
// ▼使い方
//   - 各種モーダルUIの共通部品として利用
// =====================================================

// ===== import: 外部ライブラリ =====
import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";

// ===== 型定義 =====
interface CustomModalProps {
  isOpen: boolean; // モーダル表示状態
  onClose: () => void; // 閉じるハンドラ
  children: React.ReactNode; // モーダル中身
}

/**
 * 共通モーダルオーバーレイ
 * - ESCキー/オーバーレイ外クリックで閉じる
 * - 中身のデザインはchildren側で制御
 */
export const CustomModal = ({
  isOpen,
  onClose,
  children,
}: CustomModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // ESCキーで閉じる
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // オーバーレイ外クリックで閉じる
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) return null;

  return (
    <Box
      ref={overlayRef}
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      zIndex={1400}
      bg="blackAlpha.400"
      display="flex"
      alignItems="center"
      justifyContent="center"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      {/* ここではラッパーBoxのみ。bg/boxShadow/borderRadius/pは指定しない */}
      {children}
    </Box>
  );
};

// useMemo, useCallback, useState, useEffect, useRef などを必要な箇所で活用し、リスト・コールバック・初期値計算などをメモ化・最適化する（パターンはEmployeeTable/LeaveDatesModal/EmployeeModalと同様）
