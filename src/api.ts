// =====================================================
// api.ts
// -----------------------------------------------------
// このファイルはAPI通信の共通ユーティリティです。
// 主な役割:
//   - fetch+エラーハンドリング+型変換の共通化
//   - API通信の型安全・エラー共通化・保守性向上
// 設計意図:
//   - UI/ロジックからAPI通信の詳細を隠蔽し、再利用性・可読性向上
// 使い方:
//   - apiGet, apiPost等をimportしてAPI通信を行う
// =====================================================

/**
 * GETリクエスト用共通関数
 * @param url APIエンドポイント
 * @param headers 追加ヘッダー（認証等）
 * @returns パース済みデータ（型T）
 */
export async function apiGet<T>(
  url: string,
  headers?: Record<string, string>
): Promise<T> {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(headers || {}),
    },
    credentials: "include", // Sanctum用
  });
  if (!res.ok) throw new Error(`APIリクエスト失敗: ${res.status}`);
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (data && data.error) throw new Error(data.error);
    return data;
  } catch {
    throw new Error("APIレスポンスが不正です: " + text);
  }
}

/**
 * POSTリクエスト用共通関数
 * @param url APIエンドポイント
 * @param body リクエストボディ
 * @returns パース済みデータ（型T）
 */
export async function apiPost<T>(url: string, body: any): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include", // 認証Cookieを送信
  });
  if (!res.ok) throw new Error(`APIリクエスト失敗: ${res.status}`);
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (data && data.error) throw new Error(data.error);
    return data;
  } catch {
    throw new Error("APIレスポンスが不正です: " + text);
  }
}
