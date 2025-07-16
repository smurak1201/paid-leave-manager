# XSS・SQL インジェクション対策ガイド（paid-leave-manager 用）

このアプリで最低限実施すべきセキュリティ対策をまとめます。

---

## フロントエンド（React）

### 1. XSS 対策

- JSX 内で値を表示する場合は自動エスケープされるため、通常は安全です。
- ただし、`dangerouslySetInnerHTML`を使う場合や、外部データを HTML として描画する場合は必ずサニタイズが必要です。
- サニタイズには `DOMPurify` を利用します。

#### 【導入手順】

1. 依存パッケージ追加
   ```bash
   cd frontend
   npm install dompurify
   ```
2. 使い方例

   ```tsx
   import DOMPurify from "dompurify";

   // 例: APIから取得したHTMLを安全に描画
   <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(apiHtml) }} />;
   ```

---

## バックエンド（Laravel）

### 1. SQL インジェクション対策

- Eloquent ORM やクエリビルダを使う（生 SQL は避ける）。
- バリデーションを徹底する（`FormRequest`や`$request->validate()`）。

### 2. XSS 対策

- Blade テンプレートで出力する場合は `{{ $var }}` を使う（自動エスケープ）。
- API で返す値は、フロント側でサニタイズする。

#### 【バリデーション例】

```php
// app/Http/Requests/EmployeeRequest.php
public function rules()
{
    return [
        'name' => 'required|string|max:255',
        'email' => 'required|email',
        // ...他のバリデーション
    ];
}
```

---

## 追加の推奨事項

- フロント・バックともに、入力値の長さ・形式チェックを徹底する。
- 不要な HTML タグやスクリプトを許可しない。
- エラーメッセージや API レスポンスに機密情報を含めない。

---

## 参考

- [DOMPurify 公式](https://github.com/cure53/DOMPurify)
- [Laravel バリデーション公式](https://laravel.com/docs/validation)

---

このガイドに沿って実装すれば、基本的な XSS・SQL インジェクション対策は十分です。
