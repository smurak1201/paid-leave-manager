// =============================
// main.tsx
// アプリのエントリーポイント
// =============================
//
// 役割:
// ・Reactアプリのルート要素を作成し、ProviderやAppをラップして描画
//
// 設計意図:
// ・Providerで全体のUIテーマやグローバルな設定を一元管理
//
// ===== import: 外部ライブラリ =====
import React from "react";
import ReactDOM from "react-dom/client";

// ===== import: UI/Provider =====
import { Provider } from "@/components/ui/provider";

// ===== import: アプリ本体 =====
import App from "./App";

// useMemo, useCallback, useState, useEffect, useRef などを必要な箇所で活用し、リスト・コールバック・初期値計算などをメモ化・最適化する（パターンはEmployeeTable/LeaveDatesModal/EmployeeModalと同様）

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>
);
