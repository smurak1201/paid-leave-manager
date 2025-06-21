// =============================
// utils.ts
// 業務ロジック・ユーティリティ関数ファイル
// =============================
//
// このファイルは有給休暇管理アプリ全体で使う業務ロジック・ユーティリティ関数を一元管理します。
// - 有給付与日数計算・日付バリデーション等の共通ロジック
// - UI部品から独立して再利用性・テスト容易性を向上
//
// 設計意図:
// - 業務ロジックをUI部品から分離し、可読性・保守性・テスト容易性を向上
// - 初学者でも理解しやすいように関数の意味・用途を日本語コメントで明記
//
// 主な業務ロジック・ユーティリティ関数:
// - calcLeaveDays: 勤続年数から付与される有給休暇の日数を計算
// - calcStrictRemain: 付与履歴・消化履歴から厳密に残日数を計算
//
// 使い方:
// これらの関数は他のモジュールからインポートして使用します。
// 例えば、`calcLeaveDays('2021-01-01')`のように呼び出します。

import type { LeaveGrant } from "./types";

// 勤続年数（月単位）から付与日数を返す関数
// 日本の有給休暇制度に基づき、入社日と現在日から自動計算します。
export function calcLeaveDays(
  joinedAt: string,
  now: Date = new Date()
): number {
  if (!joinedAt.match(/^\d{4}-\d{2}-\d{2}$/)) return 10;
  const join = new Date(joinedAt);
  const diff =
    (now.getFullYear() - join.getFullYear()) * 12 +
    (now.getMonth() - join.getMonth());
  if (diff < 6) return 0;
  if (diff < 18) return 10;
  if (diff < 30) return 11;
  if (diff < 42) return 12;
  if (diff < 54) return 14;
  if (diff < 66) return 16;
  if (diff < 78) return 18;
  return 20;
}

// 付与履歴・消化履歴から有効な残日数を厳密に計算する関数
// 2年時効・古い付与分から消化など、日本法令に即したロジックです。
export function calcStrictRemain(
  grants: LeaveGrant[] = [],
  leaveDates: string[] = [],
  now: Date = new Date()
): number {
  // 1. 2年以内の付与分のみ有効
  const validGrants = grants
    .filter((g) => {
      const grantDate = new Date(g.grantDate);
      const diff =
        (now.getFullYear() - grantDate.getFullYear()) * 12 +
        (now.getMonth() - grantDate.getMonth());
      return diff < 24; // 24か月未満
    })
    .sort(
      (a, b) =>
        new Date(a.grantDate).getTime() - new Date(b.grantDate).getTime()
    );

  // 2. 古い付与分から順に消化
  const usedDates = [...leaveDates].sort(); // 昇順（日付が古い順）
  let remainList = validGrants.map((g) => ({ days: g.days, used: 0 }));
  let usedIdx = 0;
  for (let i = 0; i < remainList.length && usedIdx < usedDates.length; ) {
    if (remainList[i].days - remainList[i].used > 0) {
      remainList[i].used++;
      usedIdx++;
    } else {
      i++;
    }
  }
  // 3. 残日数合計
  return remainList.reduce((sum, g) => sum + (g.days - g.used), 0);
}
