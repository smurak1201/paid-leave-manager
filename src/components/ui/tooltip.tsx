// =============================
// tooltip.tsx
// 汎用ツールチップUI部品
// =============================
//
// 役割:
// ・Chakra UIベースのカスタムツールチップ
//
// 設計意図:
// ・再利用性・アクセシビリティ・柔軟なカスタマイズ性向上
// ・UI部品の責務分離・props型の明示
//
// 使い方:
// <Tooltip content="説明文">...</Tooltip>
//
// - showArrow: 矢印表示
// - portalled: Portalでbody直下に描画するか
// - content: ツールチップ内容
// - contentProps: ChakraTooltip.ContentPropsを追加で渡せる
// - disabled: 無効化

import { Tooltip as ChakraTooltip, Portal } from "@chakra-ui/react";
import * as React from "react";

export interface TooltipProps extends ChakraTooltip.RootProps {
  showArrow?: boolean;
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  content: React.ReactNode;
  contentProps?: ChakraTooltip.ContentProps;
  disabled?: boolean;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
    const {
      showArrow,
      children,
      disabled,
      portalled = true,
      content,
      contentProps,
      portalRef,
      ...rest
    } = props;

    if (disabled) return children;

    return (
      <ChakraTooltip.Root {...rest}>
        <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
        <Portal disabled={!portalled} container={portalRef}>
          <ChakraTooltip.Positioner>
            <ChakraTooltip.Content ref={ref} {...contentProps}>
              {showArrow && (
                <ChakraTooltip.Arrow>
                  <ChakraTooltip.ArrowTip />
                </ChakraTooltip.Arrow>
              )}
              {content}
            </ChakraTooltip.Content>
          </ChakraTooltip.Positioner>
        </Portal>
      </ChakraTooltip.Root>
    );
  }
);

// useMemo, useCallback, useState, useEffect, useRef などを必要な箇所で活用し、リスト・コールバック・初期値計算などをメモ化・最適化する（パターンはEmployeeTable/LeaveDatesModal/EmployeeModalと同様）
