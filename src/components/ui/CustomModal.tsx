// =============================
// CustomModal.tsx
// 共通モーダルオーバーレイUI
// =============================
//
// 役割:
// ・モーダルのオーバーレイ・中央寄せ・ESC/外クリック閉じ
// ・中身のUI（白背景・角丸・影など）はchildren側で制御
//
// 設計意図:
// ・UI部品の責務分離・再利用性・アクセシビリティ向上
// ・Chakra UIのBoxでシンプルに実装
//
// import分類:
// - React本体・フック
// - Chakra UI部品

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
