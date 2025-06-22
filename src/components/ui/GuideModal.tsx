import type { GuideModalProps } from "../employee/types";

// props型はtypes.tsで一元管理
export const GuideModal: React.FC<GuideModalProps> = ({ open }) => {
  if (!open) return null;
  // ...既存のモーダルUI描画...
  // ...existing code...
};
