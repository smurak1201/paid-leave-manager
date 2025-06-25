import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MotionLi = motion.li;

export const FadeListItem: React.FC<
  Omit<
    React.LiHTMLAttributes<HTMLLIElement>,
    | "onDrag"
    | "onDragStart"
    | "onDragEnd"
    | "onDragOver"
    | "onDragEnter"
    | "onDragLeave"
    | "onDrop"
    | "onDragExit"
    | "onDragExitCapture"
    | "onDragOverCapture"
    | "onDragStartCapture"
    | "onDropCapture"
    | "onAnimationStart"
    | "onAnimationEnd"
    | "onAnimationIteration"
  > & { inProp?: boolean }
> = ({ inProp = true, children, ...rest }) => {
  const animationProps = useMemo(
    () => ({
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
      transition: { duration: 0.3 },
    }),
    []
  );
  return (
    <MotionLi {...animationProps} {...rest}>
      {children}
    </MotionLi>
  );
};
