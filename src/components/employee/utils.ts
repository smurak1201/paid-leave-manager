import type { LeaveGrant } from "./types";

// 勤続年数（月単位）から付与日数を返す
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

// 付与履歴・消化履歴から有効な残日数を厳密に計算（2年時効・古い付与分から消化）
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
