// api.ts: バックエンドAPIとの通信を共通化するユーティリティ
// fetch+エラーハンドリング+型変換を一元化

export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url);
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

export async function apiPost<T>(url: string, body: any): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
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
