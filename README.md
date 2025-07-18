# 有給休暇管理アプリ（React + Laravel モノレポ）

このアプリは、日本の労働基準法・厚生労働省ガイドラインに準拠した有給休暇管理を効率化する Web アプリです。従業員ごとの有給付与・消化・繰越・時効消滅を自動計算し、直感的な UI で管理できます。

---

## リポジトリ構成

- `frontend/` : フロントエンド（React + Vite）
- `backend/` : バックエンド（Laravel API）

---

## クイックスタート

### 1. フロントエンド（React/Vite）

```bash
cd frontend
npm install
npm run dev
# ブラウザで http://localhost:5173 を開く
```

### 2. バックエンド（Laravel）

```bash
cd backend
composer install
cp .env.example .env # 必要に応じて
php artisan key:generate
php artisan migrate --seed
php artisan serve # http://localhost:8000 で API 起動
```

---

## ディレクトリ構成（抜粋）

- `frontend/src/` : React/TypeScript の主要ソース
- `frontend/public/` : 静的ファイル
- `backend/app/` : Laravel コントローラ・モデル等
- `backend/database/` : マイグレーション・シーダー
- `backend/routes/` : API/Web ルーティング
- `backend/public/` : 公開用エントリ
- `backend/.env` : バックエンド環境設定

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

## 主な機能

- 従業員管理（追加・編集・削除、サンプルデータ初期表示）
- 有給休暇管理（勤続年数に応じた付与日数自動計算、取得日リスト追加・削除、消化・繰越・時効消滅ロジック）
- 最大保有日数 40 日、FIFO（先入れ先出し）消化順序
- バリデーション・エラーハンドリング（即時チェック、重複エラー、フォームリセット、API 統一）
- UI/UX（モーダル操作、ページネーション、ガイドモーダル）
- 責務分離・型安全設計・設計コメント（型定義、カスタムフック、ユーティリティ、設計意図コメント）
- RESTful API 設計（全 API 統一、CORS・型整合性考慮）

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
- モーダルによる直感的な操作
- 従業員・有給取得日・付与マスター API すべて RESTful 設計で統一

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
