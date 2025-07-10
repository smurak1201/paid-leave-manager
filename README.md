# 有給休暇管理アプリ（React + Laravel）

このアプリは、日本の労働基準法・厚生労働省ガイドラインに準拠した有給休暇管理を効率化するための Web アプリです。従業員ごとの有給付与・消化・繰越・時効消滅を自動計算し、直感的な UI で管理できます。

---

## クイックスタート

### フロントエンド（React/Vite）

1. `npm install` で依存パッケージをインストール
2. `npm run dev` でローカル開発サーバー起動
3. ブラウザで `http://localhost:5173` を開く

### バックエンド（Laravel）

1. `composer install` で依存パッケージをインストール
2. `.env` 設定（DB 接続・APP_KEY 生成など）
3. `php artisan migrate --seed` で DB 初期化・マスターデータ投入
4. `php artisan serve` でローカル API サーバー起動

---

## 主な機能

- **従業員管理**
  - 従業員の追加・編集・削除
  - サンプルデータによる初期表示
- **有給休暇管理**
  - 勤続年数に応じた有給付与日数の自動計算（正社員モデル・日本法令準拠）
  - 有給取得日リストの追加・削除
  - 有給消化・繰越・2 年時効消滅ロジック
  - 最大保有日数 40 日、FIFO（先入れ先出し）消化順序に対応
- **バリデーション・エラーハンドリング**
  - 入力値の即時チェック、重複エラーの即時表示
  - フォームリセット・モーダル閉時の状態初期化
  - サーバー側バリデーション（FormRequest）・API エラー統一
- **UI/UX**
  - モーダルによる直感的な操作
  - ページネーション（従業員・有給日一覧）
  - ガイドモーダルによる制度説明
- **責務分離・型安全設計・設計コメント**
  - 型定義・カスタムフック・ユーティリティによるロジック分離
  - 主要なファイル・関数・props・型定義に「設計意図・役割・ロジックや変数の解説コメント」を付与
  - 保守性・可読性重視
  - バックエンド・フロントエンドともに統一フォーマットの設計コメント
- **RESTful API 設計**
  - 従業員・有給取得日・付与マスター API すべて RESTful 設計で統一
  - CORS・ネットワーク・型整合性も考慮

---

## 技術スタック

- React (Vite)
- TypeScript
- Chakra UI
- Laravel (API バックエンド)
- PHP 8.1+
- SQLite/MySQL/PostgreSQL
- ESLint/Prettier

---

## ファイル構成（抜粋）

- `src/App.tsx` : アプリ全体の状態管理・UI 構成のメインエントリ

- `src/App.tsx` : アプリ全体の状態管理・UI 構成のメインエントリ
- `src/components/employee/` : 従業員・有給日関連の UI コンポーネント群（テーブル・モーダル・リスト等）
- `src/components/ui/` : 汎用 UI コンポーネント（モーダル・トースト・ガイド等）
- `src/hooks/` : カスタムフック（従業員・有給日データ取得/編集・フォームバリデーション等）
- `src/types/` : 型定義ファイル（従業員・有給履歴・UI 用 props 等）
- `src/api.ts` : API 通信共通処理・エラーハンドリング
- `src/api/employeeApi.ts` : 従業員 API 通信ロジック
- `src/api/leaveUsageApi.ts` : 有給取得日 API 通信ロジック
- `src/api/leaveGrantMasterApi.ts` : 付与マスター API 通信ロジック
- `src/components/employee/utils.ts` : 有給付与・残日数計算等のユーティリティ関数
- `src/learning_guide.md` : フロントエンド設計・コードリーディングガイド
- `app/Http/Controllers/EmployeesController.php` : 従業員 API コントローラ
- `app/Http/Controllers/LeaveUsageController.php` : 有給取得日・消化・繰越・時効消滅ロジック
- `app/Http/Controllers/LeaveGrantMasterController.php` : 付与マスター API コントローラ
- `app/Http/Requests/EmployeeRequest.php` : 従業員バリデーション(FormRequest)
- `database/seeders/AdminEmployeeSeeder.php` : 管理者従業員用シーダー
- `database/seeders/LeaveGrantMasterSeeder.php` : 有給付与マスター用シーダー
- `backend_learning_guide.md` : Laravel バックエンド学習ガイド

---

## 実装済みロジック（2025 年 7 月現在）

- 勤続年数に応じた付与日数自動計算（正社員モデル）
- 付与日ごとに 2 年の有効期限管理
- 前回付与分の残日数（最大 20 日）を繰越
- 最大保有日数 40 日（付与＋繰越の合計）
- FIFO（先入れ先出し）消化順序
- 有効期限切れ分の自動失効
- 日単位での有給取得・管理
- API/型/コメントの統一・リファクタリング

---

## 未対応・追加実装が必要な主なロジック

- 年 5 日取得義務（2019 年法改正）
- 出勤率 8 割判定による付与可否
- 雇用形態別付与（パート・短時間労働者等）
- 時間単位・半日単位有給
- 付与基準日（入社日以外の基準日管理）
- 失効日数の明示・管理
- 特別休暇・その他休暇との区別

これらの要件が必要な場合は、個別に追加実装が必要です。

---

## 学習・実務での活用ポイント

- コントローラ・モデル・FormRequest（バリデーション）・業務ロジックの分離、冒頭の設計コメントを参考に、React/Laravel API 設計・法令準拠ロジックの実装例として活用できます。
- 詳細は `learning_guide.md`（フロントエンド）、`backend_learning_guide.md`（バックエンド）を参照してください。

---

## 生成 AI の利用について

本アプリの設計・リファクタリング・ドキュメント作成には、GitHub Copilot（2024 年 6 月時点のバージョン）を活用しています。

---

## ライセンス

MIT
