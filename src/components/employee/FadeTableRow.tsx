import React from "react";
import { motion } from "framer-motion";

const MotionTr = motion.tr;

export const FadeTableRow: React.FC<
  React.ComponentPropsWithoutRef<"tr"> & { inProp?: boolean }
> = ({
  inProp = true,
  children,
  onAnimationStart,
  onDragStart,
  onDragEnd,
  onDrag,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  ...rest
}) => {
  return (
    <MotionTr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      {...rest}
    >
      {children}
    </MotionTr>
  );
};
