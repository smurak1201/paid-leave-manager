// =============================
// toaster.tsx
// 汎用トースト通知UI部品
// =============================
//
// 役割:
// ・Chakra UIベースのカスタムトースト通知
//
// 設計意図:
// ・グローバルな通知・ローディング・エラー表示の共通化
// ・UI部品の責務分離・props型の明示
//
// 使い方:
// import { toaster, Toaster } from "./toaster";
// toaster.show({ title: "保存しました" }) など
//
// - Toaster: 画面のどこかで一度だけ配置
// - toaster: imperative APIで通知表示

"use client";

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
});

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => (
          <Toast.Root width={{ md: "sm" }}>
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

// =============================
// 追加・修正時は「どこで使うか」「設計意図」を必ずコメントで明記すること！
// =============================
