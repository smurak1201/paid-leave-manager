// =====================================================
// toaster.tsx
// -----------------------------------------------------
// このファイルはトースト通知UI部品です。
// 主な役割:
//   - 成功・エラー等の通知UI
// 設計意図:
//   - 通知UIの責務分離・再利用性重視
//   - propsでメッセージ・状態を受け取る
// 使い方:
//   - 各種通知UIとしてimportして利用
// =====================================================
//
// 役割:
// ・Chakra UIベースのカスタムトースト通知
//
// 設計意図:
// ・グローバルな通知・ローディング・エラー表示の共通化
// ・UI部品の責務分離・props型の明示
//
// import分類:
// - Chakra UI部品
// - React本体・フック

"use client";

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react";
import { useMemo } from "react";

/**
 * toaster: imperative APIで通知表示
 * Toaster: 画面のどこかで一度だけ配置
 */
export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
});

export const Toaster = () => {
  const toastRootWidth = useMemo(() => ({ md: "sm" }), []);

  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => (
          <Toast.Root width={toastRootWidth}>
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};
