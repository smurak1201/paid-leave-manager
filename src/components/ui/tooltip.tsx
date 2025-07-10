// =====================================================
// tooltip.tsx
// -----------------------------------------------------
// 【有給休暇管理アプリ】ツールチップUI部品
// -----------------------------------------------------
// ▼主な役割
//   - ツールチップ表示UI
// ▼設計意図
//   - UI部品の責務分離・再利用性重視
//   - propsで内容・表示状態を受け取る
// ▼使い方
//   - 各種UI部品でimportして利用
// =====================================================

// ===== import: 外部ライブラリ =====
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

/**
 * Tooltip
 * - Chakra UIベースのカスタムツールチップ
 * - showArrow, portalled, content等で柔軟に制御
 */
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
