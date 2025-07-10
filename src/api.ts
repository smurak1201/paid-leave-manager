
// =====================================================
// api.ts
// -----------------------------------------------------
// 【有給休暇管理アプリ】API通信共通ユーティリティ
// -----------------------------------------------------
// ▼主な役割
//   - fetch+エラーハンドリング+型変換の共通化
// ▼設計意図
//   - API通信の型安全・UIからの分離・保守性向上
// ▼使い方
//   - apiGet, apiPost等をimportしてAPI通信を行う
// =====================================================


// ===== GETリクエスト用共通関数 =====
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
    credentials: "include", // 認証Cookie送信
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

// ===== POSTリクエスト用共通関数 =====
export async function apiPost<T>(url: string, body: any, headers?: Record<string, string>): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(headers || {}),
    },
    body: JSON.stringify(body),
    credentials: "include", // 認証Cookie送信
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
