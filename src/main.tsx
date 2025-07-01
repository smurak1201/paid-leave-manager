// =====================================================
// main.tsx
// -----------------------------------------------------
// このファイルはReactアプリのエントリーポイントです。
// 主な役割:
//   - ルートコンポーネント(App)のレンダリング
//   - Chakra UI等のプロバイダ設定
// 設計意図:
//   - アプリ全体の初期化・グローバル設定を一元化
// 使い方:
//   - 通常は編集不要。アプリの起動・全体設定を行う
// =====================================================
//
// 役割:
// ・Reactアプリ全体をProviderでラップし、Appコンポーネントを描画する
// ・ProviderはChakra UIなどのテーマやグローバル設定を一括で適用する
//
// 設計意図:
// ・アプリ全体のUIテーマや状態管理を一元化し、どの画面でも同じデザイン・機能を使えるようにする
// ・main.tsxは「最小限の起動処理」だけを担い、他のロジックはAppや各コンポーネントに分離

// ===== import: React本体・DOM描画 =====
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
