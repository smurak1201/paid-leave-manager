// =============================
// utils.ts
// 業務ロジック・ユーティリティ関数
// =============================
//
// 役割:
// ・有給付与日数計算・残日数計算などの共通ロジック
//
// 設計意図:
// ・UI部品から分離し、再利用性・可読性・テスト容易性を向上
// ・日本の有給休暇法令に即したロジックを一元管理
// ・初学者が「どの関数がどこで使われるか」理解しやすいようにコメント充実

// ===== import: 型定義 =====
import type { LeaveGrant, Employee } from "./types";

/**
 * 勤続年数（月単位）から付与日数を返す関数
 * @param joinedAt 入社年月日(YYYY-MM-DD)
 * @param now 現在日時（省略時はnew Date()）
 * @returns 付与日数（日本の有給休暇制度に基づく）
 *
 * - EmployeeModal, getEmployeeLeaveSummary等で利用
 * - 入社半年未満は0日、以降は法定通り段階的に増加
 */
export function calcLeaveDays(
  joinedAt: string,
  now: Date = new Date()
): number {
  if (!joinedAt.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) return 10;
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

/**
 * 勤続年数・付与回数から法定付与日数を返すマスタ関数
 * @param joinedAt 入社日
 * @param grantDate 付与日
 * @returns 付与日数
 */
export function getLegalGrantDays(
  joinedAt: string,
  grantDate: string
): number {
  // 入社日と付与日から勤続月数を算出
  const join = new Date(joinedAt);
  const grant = new Date(grantDate);
  const diff =
    (grant.getFullYear() - join.getFullYear()) * 12 +
    (grant.getMonth() - join.getMonth());
  if (diff < 6) return 0;
  if (diff < 18) return 10;
  if (diff < 30) return 11;
  if (diff < 42) return 12;
  if (diff < 54) return 14;
  if (diff < 66) return 16;
  if (diff < 78) return 18;
  return 20;
}

/**
 * 付与履歴・消化履歴から有効な残日数を厳密に計算する関数
 * @param grants LeaveGrant[] 付与履歴
 * @param leaveDates string[] 有給取得日
 * @param now 現在日時（省略時はnew Date()）
 * @returns 残日数（2年時効・古い付与分から消化など日本法令に即す）
 *
 * - EmployeeTable, LeaveDatesModal等で利用
 * - 2年以内の付与分のみ有効、古い付与分から順に消化
 */
export function calcStrictRemain(
  grants: LeaveGrant[] = [],
  leaveDates: string[] = [],
  now: Date = new Date(),
  joinedAt?: string
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
  let remainList = validGrants.map((g) => ({
    days: joinedAt ? getLegalGrantDays(joinedAt, g.grantDate) : 0,
    used: 0
  }));
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

/**
 * 指定従業員の有給休暇サマリー（今年度付与・繰越・消化・残日数）を返す共通関数
 * @param employeeId 従業員ID
 * @param leaveUsages 有給消化履歴
 * @param employees 従業員テーブル
 * @param now 現在日時（省略時はnew Date()）
 * @returns grantThisYear:今年度付与, carryOver:繰越, used:消化, remain:残
 *
 * - EmployeeTable, EmployeeModal等で利用
 * - grant/carryOver/used/remainの計算を一元化
 */
export function getEmployeeLeaveSummary(
  employeeId: number,
  leaveUsages: { employeeId: number; usedDate: string; grantDate: string }[] | undefined,
  employees: Employee[] | undefined,
  now: Date = new Date()
): {
  grantThisYear: number;
  carryOver: number;
  used: number;
  remain: number;
} {
  if (!employees || !Array.isArray(employees)) {
    return { grantThisYear: 0, carryOver: 0, used: 0, remain: 0 };
  }
  const emp = employees.find((e) => e.id === employeeId);
  if (!emp) return { grantThisYear: 0, carryOver: 0, used: 0, remain: 0 };
  // 付与履歴を生成
  const grants: { grantDate: string; days: number }[] = []; //generateLeaveGrants(
    //emp,
    //now.toISOString().slice(0, 10)
  //);
  let grantThisYear = 0;
  let carryOver = 0;
  // 今年度・前年度の付与分を集計
  grants.forEach((g) => {
    const grantDate = new Date(g.grantDate);
    const grantYear = grantDate.getFullYear();
    const nowYear = now.getFullYear();
    const diffMonth =
      (now.getFullYear() - grantDate.getFullYear()) * 12 +
      (now.getMonth() - grantDate.getMonth());
    if (grantYear === nowYear && diffMonth < 24) {
      grantThisYear += g.days;
    } else if (grantYear === nowYear - 1 && diffMonth < 24) {
      carryOver += g.days;
    }
  });
  // 消化日数
  const used = (leaveUsages || []).filter((u) => u.employeeId === employeeId).length;
  const remain = grantThisYear + carryOver - used;
  return { grantThisYear, carryOver, used, remain };
}
