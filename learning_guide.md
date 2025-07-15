# 有給休暇管理アプリ ソースコード学習ガイド（React + Laravel）

このガイドは、フロントエンド（React/TypeScript）とバックエンド（Laravel/PHP）を「別々に学ぶ」ことで、各層の設計思想・役割・学習ポイントをより効率的に理解できるよう構成しています。

それぞれの技術は設計や責務が異なるため、まずはフロントエンド側の UI・型・データフロー・API 通信の流れを、次にバックエンド側の API 設計・業務ロジック・バリデーション・DB 設計を分けて学ぶことで、全体像と連携が明確になります。

---

## 1. フロントエンド（React/TypeScript）学習ガイド

### React とは？

React は Facebook が開発した「UI（ユーザーインターフェース）構築用の JavaScript ライブラリ」です。コンポーネント単位で画面を分割し、状態管理やデータフローを効率的に扱えるのが特徴です。

- 仮想 DOM による高速な描画
- 単方向データフローでバグが少なく保守しやすい
- 再利用可能なコンポーネント設計
- TypeScript との組み合わせで型安全な開発が可能

---

### 学習時に意識すべきポイント

- **責務分離**: 各コンポーネント・フック・ユーティリティの「役割」を意識し、どこで何を担当しているかを把握しましょう。
- **型安全性**: TypeScript の型定義（`frontend/src/types/employee.ts` など）を確認し、props や state の型がどのように守られているかを意識しましょう。
- **単方向データフロー**: props/state の流れ（親 → 子、id のみ渡しデータ参照は親で一元管理）を追い、React の設計思想を体感しましょう。
- **UI/UX 設計**: Chakra UI や lucide-react の使い方、バリデーション・エラーメッセージ・モーダルの UX 改善ポイントを観察しましょう。
- **バリデーション共通化**: カスタムフックやユーティリティでバリデーション処理がどのように共通化されているかを確認しましょう（例：従業員コードは半角英数字・重複不可、即時エラー表示）。
- **コメントの活用**: 主要ファイル・関数・props・型定義に「設計意図・役割・import 分類・ロジックや変数の解説コメント」が付与されています。まずコメントを読み、全体像 → 詳細の順で理解を深めましょう。
- **業務ロジック**: 有給付与・消化・繰越・時効消滅・最大保有日数・FIFO 消化順序など、日本法令に即したロジックがどこでどう実装されているかを意識しましょう（主に `backend/app/Http/Controllers/LeaveUsageController.php` で一元管理、フロントエンドの型・コメントも参照）。
- **可読性・保守性**: コードの分割・命名・重複排除・初学者向け配慮・責務分離・型安全性など、読みやすさ・直しやすさの工夫を探しましょう。
- **ガイドの活用**: 画面右上のガイドボタンから「有給休暇管理ガイド」モーダルを開き、法令準拠のロジックやサンプル表・未対応要件も確認できます。

### ソースコードを読むおすすめの順序

1. **`frontend/src/App.tsx`**
   - アプリ全体の状態管理・UI 構成・props/state の流れ・イベントハンドラの全体像を把握。
   - コメントで設計意図や流れが明記されているので、まずここをじっくり読みましょう。
2. **型定義**
   - `frontend/src/types/employee.ts`, `frontend/src/types/leaveUsage.ts`, `frontend/src/types/employeeSummary.ts`（型定義）
   - どんなデータ構造を扱うか、型安全性の担保方法・型ファイルの分割意図を確認。
3. **主要 UI コンポーネント**
   - `frontend/src/components/employee/EmployeeTable.tsx`（従業員一覧テーブル）
   - `frontend/src/components/employee/EmployeeModal.tsx`（従業員追加・編集モーダル）
   - `frontend/src/components/employee/LeaveDatesModal.tsx`（有給日管理モーダル）
   - `frontend/src/components/employee/LeaveDateList.tsx`（有給日リスト）
   - それぞれの責務・props・UI/UX 設計・バリデーションの流れを追いましょう。
4. **カスタムフック・ユーティリティ**
   - `frontend/src/hooks/useEmployeeForm.ts`（従業員フォーム管理・バリデーション）
   - `frontend/src/hooks/useLeaveDates.ts`（有給日編集ロジック）
   - `frontend/src/components/employee/utils.ts`（UI 用ロジック）
   - 共通化・再利用性・ロジック分離の工夫を確認。
5. **UI 部品・アイコン・ガイド**
   - `frontend/src/components/employee/icons.ts`（アイコン管理）
   - `frontend/src/components/ui/GuideModal.tsx`（有給休暇管理ガイドモーダル：制度ロジック・未対応要件も明記）
   - `frontend/src/components/ui/tooltip.tsx`, `frontend/toaster.tsx`, `frontend/provider.tsx`, `frontend/CustomModal.tsx`, `frontend/ConfirmDeleteModal.tsx`, `frontend/color-mode.tsx`（UI 部品の責務分離・設計コメント例）
   - UI の細部や学習サポートの工夫を観察。
6. **API・設定ファイル**
   - `frontend/src/api.ts`（API 通信共通化・エラーハンドリング）
   - `frontend/package.json`, `frontend/tsconfig.*.json`, `frontend/vite.config.ts`, `frontend/eslint.config.js` など
   - 必要最小限の設定・不要記述の排除・型/構文チェックの工夫を確認。
7. **バックエンド主要ロジック**
   - `backend/app/Http/Controllers/LeaveUsageController.php`（有給付与・消化・繰越・時効消滅・最大保有日数・FIFO 消化順序ロジック）
   - Laravel のルーティング・モデル・バリデーション・API レスポンス設計も参考に。

---

## 2. バックエンド（Laravel/PHP）学習ガイド

### Laravel とは？

Laravel は PHP で作られた「Web アプリ開発用フレームワーク」です。MVC（Model-View-Controller）設計を採用し、API や Web サービスを効率よく・安全に・きれいに作ることができます。

- 豊富な機能（ルーティング、認証、バリデーション、マイグレーション等）
- コードの保守性・拡張性が高い
- RESTful API 設計が容易
- 初心者にも学びやすい設計思想

#### MVC とは？

MVC（Model-View-Controller）は、アプリケーションを「モデル（Model）」「ビュー（View）」「コントローラ（Controller）」の 3 つの役割に分けて設計するパターンです。

- **Model**: データベースとのやりとりや業務ロジックを担当
- **View**: 画面表示やレスポンスの生成（Laravel では API の場合は JSON レスポンスが主）
- **Controller**: リクエストを受けて処理を振り分ける役割

#### API とは？

API（Application Programming Interface）は、アプリケーション同士がデータや機能をやりとりするための「窓口」です。Web API は、HTTP リクエスト（GET/POST/PUT/DELETE など）でデータの取得・登録・更新・削除を行います。

#### RESTful API とは？

RESTful API は「リソース（データのまとまり）」ごとに URL と HTTP メソッドを分けて操作する設計思想です。

- 例：`GET /api/employees`（従業員一覧取得）、`POST /api/employees`（従業員追加）、`DELETE /api/employees/{id}`（従業員削除）
- 一貫したルールで API 設計できるため、保守性・拡張性が高くなります。

---

### 学習時に意識すべきポイント

- **責務分離**: ルート（`backend/routes/api.php`）→ コントローラ（`backend/app/Http/Controllers/`）→ モデル（`backend/app/Models/`）→ FormRequest（`backend/app/Http/Requests/`）と役割が分かれています。
- **バリデーション**: API に送られてくるデータが正しいかどうかを `$request->validate` や FormRequest でチェック。
- **業務ロジック**: 有給付与・消化・繰越・時効消滅・最大保有日数・FIFO 消化順序など、日本の法律に沿ったルールがどこでどう実装されているか。
- **API 設計**: RESTful（リソースごとに URL と HTTP メソッドで操作を分ける）な設計。
- **モデル設計**: `Employee`, `LeaveUsage`, `LeaveGrantMaster` などのモデルは、DB テーブルと 1 対 1 で対応。
- **保守性・拡張性**: コードの分割・命名・バリデーション共通化・例外処理の工夫。
- **法令準拠ロジック**: 日本の有給休暇制度にどこまで対応しているか、未対応要件は何か。

### ソースコードを読むおすすめの順序

1. **`backend/routes/api.php`**
2. **コントローラ**: `backend/app/Http/Controllers/LeaveUsageController.php`, `backend/app/Http/Controllers/EmployeesController.php`
3. **モデル**: `backend/app/Models/Employee.php`, `backend/app/Models/LeaveUsage.php`, `backend/app/Models/LeaveGrantMaster.php`
4. **FormRequest**: `backend/app/Http/Requests/EmployeeRequest.php`
5. **Seeder・マスターデータ**: `backend/database/seeders/LeaveGrantMasterSeeder.php`
6. **バリデーション・エラー処理**: 各 API の `$request->validate` や FormRequest の流れ

---

## 3. 日本の有給休暇制度に対応しているロジック・未対応ロジック（共通）

### 対応済みロジック

- 勤続年数に応じた付与日数自動計算（正社員モデル）
- 付与日ごとに 2 年の有効期限管理
- 前回付与分の残日数（最大 20 日）を繰越
- 最大保有日数 40 日（付与＋繰越の合計）
- FIFO（先入れ先出し）消化順序
- 有効期限切れ分の自動失効
- 日単位での有給取得・管理

### 未対応・追加実装が必要な主なロジック

- 年 5 日取得義務（2019 年法改正）
- 出勤率 8 割判定による付与可否
- 雇用形態別付与（パート・短時間労働者等）
- 時間単位・半日単位有給
- 付与基準日（入社日以外の基準日管理）
- 失効日数の明示・管理
- 特別休暇・その他休暇との区別

---

## 4. 学びを深めるためのアクション例

- コメントや設計意図を参考に、props/state や型定義・DB 設計を自分で図解してみる
- バリデーションやロジック部分を書き換えて動作を試す
- UI/UX・API・モデル・Seeder・マスターデータの改善案を考え、実際にコードを修正してみる
- 新しい従業員属性や有給ルール・付与ロジックを追加してみる
- コード分割や型定義・設計コメントの工夫を他のプロジェクトにも応用してみる

---

## 5. まとめ

- 「なぜこの設計なのか」「どこで何をしているか」を常に意識し、コメントや関数名・型定義・DB 設計を手がかりに全体像 → 詳細へと段階的に理解を深めましょう。
- 疑問点や改善案があれば、実際に手を動かして試すことでより実践的な力が身につきます。
- 設計コメントを活用し、他のプロジェクトや実務にも応用できる「設計意図を伝える力」を養いましょう。

---

このガイドを活用し、実務・学習の両面で役立つ React ＋ TypeScript／Laravel ＋ PHP アプリ開発力を身につけてください！
