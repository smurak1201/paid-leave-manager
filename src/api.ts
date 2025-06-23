// api.ts: バックエンドAPIとの通信を共通化するユーティリティ
// fetch+エラーハンドリング+型変換を一元化

export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("APIレスポンスが不正です: " + text);
  }
  if (data && data.error) throw new Error(data.error);
  return data;
}

export async function apiPost<T>(url: string, body: any): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("APIレスポンスが不正です: " + text);
  }
  if (data && data.error) throw new Error(data.error);
  return data;
}
