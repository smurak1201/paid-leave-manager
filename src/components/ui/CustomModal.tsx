import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

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
    >
      {/* ここではラッパーBoxのみ。bg/boxShadow/borderRadius/pは指定しない */}
      {children}
    </Box>
  );
};
