// =====================================================
// main.tsx
// -----------------------------------------------------
// 【有給休暇管理アプリ】Reactアプリのエントリーポイント
// -----------------------------------------------------
// ▼主な役割
//   - ルートコンポーネント(App)のレンダリング
//   - Chakra UI等のプロバイダ設定
// ▼設計意図
//   - アプリ全体の初期化・グローバル設定を一元化
// ▼使い方
//   - 通常は編集不要。アプリの起動・全体設定を行う
// =====================================================

// ===== import: 外部ライブラリ =====
import React from "react";
import ReactDOM from "react-dom/client";

// ===== import: UIテーマProvider =====
import { Provider } from "@/components/ui/provider";

// ===== import: アプリ本体 =====
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>
);
