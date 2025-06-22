// =============================
// sampleData/dbSampleTables.ts
// バックエンドDBテーブルを想定したサンプルデータ集約
// =============================
//
// ・従業員テーブル: id, lastName, firstName, joinedAt
// ・有給付与テーブル: id, employeeId, grantDate
// ・有給消化テーブル: id, employeeId, usedDate, grantId(消化元付与)

// ===== 有給付与マスタテーブル（法定付与日数表） =====
// id, years, months, days
export const leaveGrantMaster = [
  { id: 1, years: 0, months: 6, days: 10 },   // 入社6か月
  { id: 2, years: 1, months: 6, days: 11 },  // 1年6か月
  { id: 3, years: 2, months: 6, days: 12 },  // 2年6か月
  { id: 4, years: 3, months: 6, days: 14 },  // 3年6か月
  { id: 5, years: 4, months: 6, days: 16 },  // 4年6か月
  { id: 6, years: 5, months: 6, days: 18 },  // 5年6か月
  { id: 7, years: 6, months: 6, days: 20 },  // 6年6か月以降
];

// ===== 従業員テーブル =====
export const employees = [
  { id: 1, employeeCode: 1, lastName: "山田", firstName: "太郎", joinedAt: "2021-02-15" },
  { id: 2, employeeCode: 2, lastName: "佐藤", firstName: "花子", joinedAt: "2022-07-01" },
  { id: 3, employeeCode: 3, lastName: "田中", firstName: "一郎", joinedAt: "2023-11-20" },
  { id: 4, employeeCode: 4, lastName: "鈴木", firstName: "美咲", joinedAt: "2021-06-10" },
  { id: 5, employeeCode: 5, lastName: "高橋", firstName: "健", joinedAt: "2020-04-01" },
  { id: 6, employeeCode: 6, lastName: "伊藤", firstName: "彩", joinedAt: "2022-01-15" },
  { id: 7, employeeCode: 7, lastName: "渡辺", firstName: "大輔", joinedAt: "2019-10-01" },
  { id: 8, employeeCode: 8, lastName: "中村", firstName: "さくら", joinedAt: "2023-04-10" },
  { id: 9, employeeCode: 9, lastName: "小林", firstName: "直樹", joinedAt: "2020-12-01" },
  { id: 10, employeeCode: 10, lastName: "加藤", firstName: "美優", joinedAt: "2022-09-01" },
  { id: 11, employeeCode: 11, lastName: "吉田", firstName: "翔", joinedAt: "2021-03-20" },
  { id: 12, employeeCode: 12, lastName: "山本", firstName: "里奈", joinedAt: "2023-06-01" },
  { id: 13, employeeCode: 13, lastName: "斎藤", firstName: "拓海", joinedAt: "2020-08-15" },
  { id: 14, employeeCode: 14, lastName: "森田", firstName: "さやか", joinedAt: "2021-12-10" },
  { id: 15, employeeCode: 15, lastName: "石井", firstName: "亮", joinedAt: "2022-03-01" },
  { id: 16, employeeCode: 16, lastName: "上田", firstName: "美穂", joinedAt: "2020-11-11" },
];

// ===== 有給消化テーブル =====
export interface LeaveUsage {
  id: number;
  employeeId: number;
  usedDate: string;
  grantDate: string;
}
export const leaveUsages: LeaveUsage[] = [
  // id, employeeId, usedDate, grantDate
  // 山田: 11日消化（2022-02-15付与分から）
  { id: 1, employeeId: 1, usedDate: "2022-03-01", grantDate: "2022-02-15" },
  { id: 2, employeeId: 1, usedDate: "2022-04-01", grantDate: "2022-02-15" },
  { id: 3, employeeId: 1, usedDate: "2022-05-01", grantDate: "2022-02-15" },
  { id: 4, employeeId: 1, usedDate: "2022-06-01", grantDate: "2022-02-15" },
  { id: 5, employeeId: 1, usedDate: "2022-07-01", grantDate: "2022-02-15" },
  { id: 6, employeeId: 1, usedDate: "2022-08-01", grantDate: "2022-02-15" },
  { id: 7, employeeId: 1, usedDate: "2022-09-01", grantDate: "2022-02-15" },
  { id: 8, employeeId: 1, usedDate: "2022-10-01", grantDate: "2022-02-15" },
  { id: 9, employeeId: 1, usedDate: "2022-11-01", grantDate: "2022-02-15" },
  { id: 10, employeeId: 1, usedDate: "2022-12-01", grantDate: "2022-02-15" },
  { id: 11, employeeId: 1, usedDate: "2023-01-01", grantDate: "2022-02-15" },
  // 佐藤: 付与分すべて消化（残日数0）
  { id: 12, employeeId: 2, usedDate: "2023-08-01", grantDate: "2023-07-01" },
  { id: 13, employeeId: 2, usedDate: "2023-12-01", grantDate: "2023-07-01" },
  { id: 14, employeeId: 2, usedDate: "2024-07-10", grantDate: "2024-07-01" },
  { id: 15, employeeId: 2, usedDate: "2024-07-11", grantDate: "2024-07-01" },
  { id: 16, employeeId: 2, usedDate: "2024-07-12", grantDate: "2024-07-01" },
  { id: 17, employeeId: 2, usedDate: "2024-07-13", grantDate: "2024-07-01" },
  { id: 18, employeeId: 2, usedDate: "2024-07-14", grantDate: "2024-07-01" },
  { id: 19, employeeId: 2, usedDate: "2024-07-15", grantDate: "2024-07-01" },
  { id: 20, employeeId: 2, usedDate: "2024-07-16", grantDate: "2024-07-01" },
  { id: 21, employeeId: 2, usedDate: "2024-07-17", grantDate: "2024-07-01" },
  { id: 22, employeeId: 2, usedDate: "2024-07-18", grantDate: "2024-07-01" },
  { id: 23, employeeId: 2, usedDate: "2024-07-19", grantDate: "2024-07-01" },
  { id: 24, employeeId: 2, usedDate: "2024-07-20", grantDate: "2024-07-01" },
  { id: 25, employeeId: 2, usedDate: "2024-07-21", grantDate: "2024-07-01" },
  { id: 26, employeeId: 2, usedDate: "2024-07-22", grantDate: "2024-07-01" },
  // 田中: 今年度付与分を一部消化
  { id: 27, employeeId: 3, usedDate: "2024-04-10", grantDate: "2024-03-20" },
  { id: 28, employeeId: 3, usedDate: "2024-05-15", grantDate: "2024-03-20" },
  // 鈴木: 繰越分を消化
  { id: 29, employeeId: 4, usedDate: "2023-07-01", grantDate: "2022-06-10" },
  { id: 30, employeeId: 4, usedDate: "2023-08-01", grantDate: "2022-06-10" },
  // 高橋: 消化なし（残日数多め）
  // 伊藤: 今年度付与分を全消化
  { id: 31, employeeId: 6, usedDate: "2024-02-01", grantDate: "2024-01-15" },
  { id: 32, employeeId: 6, usedDate: "2024-02-15", grantDate: "2024-01-15" },
  { id: 33, employeeId: 6, usedDate: "2024-03-01", grantDate: "2024-01-15" },
  { id: 34, employeeId: 6, usedDate: "2024-03-15", grantDate: "2024-01-15" },
  { id: 35, employeeId: 6, usedDate: "2024-04-01", grantDate: "2024-01-15" },
  { id: 36, employeeId: 6, usedDate: "2024-04-15", grantDate: "2024-01-15" },
  { id: 37, employeeId: 6, usedDate: "2024-05-01", grantDate: "2024-01-15" },
  { id: 38, employeeId: 6, usedDate: "2024-05-15", grantDate: "2024-01-15" },
  { id: 39, employeeId: 6, usedDate: "2024-06-01", grantDate: "2024-01-15" },
  { id: 40, employeeId: 6, usedDate: "2024-06-15", grantDate: "2024-01-15" },
  // 渡辺: 2年前付与分を消化（今年度分は未消化）
  { id: 41, employeeId: 7, usedDate: "2022-11-01", grantDate: "2021-10-01" },
  { id: 42, employeeId: 7, usedDate: "2023-01-10", grantDate: "2021-10-01" },
  // ...他従業員も必要に応じて追加...
];

// =============================
// 有給付与日数算出・付与履歴・残日数集計ロジック例
// =============================

/**
 * 勤続年数（月単位）を計算
 * @param joinedAt 入社日（YYYY-MM-DD）
 * @param now 現在日付（YYYY-MM-DD）
 * @returns 勤続月数
 */
export function calcMonthsOfService(joinedAt: string, now: string): number {
  const [jy, jm] = joinedAt.split("-").map(Number);
  const [ny, nm] = now.split("-").map(Number);
  return (ny - jy) * 12 + (nm - jm);
}

/**
 * 勤続月数から該当する付与マスタを取得
 * @param months 勤続月数
 * @returns leaveGrantMasterの該当行
 */
export function getGrantMasterByMonths(months: number) {
  // 付与マスタは昇順なので、該当する最大のものを返す
  return leaveGrantMaster.reduce((acc, cur) => {
    const totalMonths = cur.years * 12 + cur.months;
    return months >= totalMonths ? cur : acc;
  }, leaveGrantMaster[0]);
}

/**
 * 従業員ごとの有給付与履歴を生成（入社日から現在まで）
 * @param employee 従業員
 * @param now 現在日付
 * @returns [{grantDate, days}[]]
 */
export function generateLeaveGrants(employee: { joinedAt: string }, now: string) {
  const grants = [];
  let grantDate = new Date(employee.joinedAt);
  // 1回目：入社日＋6か月
  grantDate.setMonth(grantDate.getMonth() + 6);
  let masterIdx = 0;
  while (grantDate <= new Date(now)) {
    // マスタは1回目のみ6か月、2回目以降は1年ごと
    const master = leaveGrantMaster[Math.min(masterIdx, leaveGrantMaster.length - 1)];
    grants.push({ grantDate: grantDate.toISOString().slice(0, 10), days: master.days });
    masterIdx++;
    // 2回目以降は1年ごと
    grantDate = new Date(grantDate);
    grantDate.setFullYear(grantDate.getFullYear() + 1);
  }
  return grants;
}

/**
 * 従業員ごとの有給残日数・消化日数を集計
 * @param employeeId 従業員ID
 * @param now 現在日付
 * @returns { totalGranted, totalUsed, remain } など
 */
export function calcLeaveSummary(employeeId: number, now: string) {
  const emp = employees.find(e => e.id === employeeId);
  if (!emp) return null;
  const grants = generateLeaveGrants(emp, now);
  // 付与ごとに消化数を集計
  const usages = leaveUsages.filter(u => u.employeeId === employeeId);
  let totalGranted = 0, totalUsed = 0;
  grants.forEach(g => {
    totalGranted += g.days;
    const used = usages.filter(u => u.grantDate === g.grantDate).length;
    totalUsed += used;
  });
  return {
    totalGranted,
    totalUsed,
    remain: totalGranted - totalUsed,
    grants,
    usages
  };
}

/**
 * 付与日ごとの有給残数・消化履歴を返す
 * @param employeeId 従業員ID
 * @param now 現在日付
 * @returns [{ grantDate, days, used, remain, usedDates: string[] }]
 *
 * - UIで「どの付与分から何日消化したか」を明示したい場合に利用
 */
export function getGrantDetails(employeeId: number, now: string) {
  const emp = employees.find(e => e.id === employeeId);
  if (!emp) return [];
  const grants = generateLeaveGrants(emp, now);
  const usages = leaveUsages.filter(u => u.employeeId === employeeId);
  return grants.map(g => {
    const usedDates = usages.filter(u => u.grantDate === g.grantDate).map(u => u.usedDate).sort();
    return {
      grantDate: g.grantDate,
      days: g.days,
      used: usedDates.length,
      remain: g.days - usedDates.length,
      usedDates,
    };
  });
}

/**
 * 指定従業員の有給休暇サマリー（今年度付与・繰越・消化・残日数）を返す共通関数
 * @param employeeId 従業員ID
 * @param leaveUsages 有給消化履歴
 * @param employees 従業員テーブル
 * @param now 現在日付（YYYY-MM-DD、省略時は今日）
 * @returns { grantThisYear, carryOver, used, remain }
 */
export function getEmployeeLeaveSummary(
  employeeId: number,
  leaveUsages: LeaveUsage[],
  employees: Array<{ id: number; employeeCode: number; lastName: string; firstName: string; joinedAt: string }>,
  now: string = new Date().toISOString().slice(0, 10)
) {
  const emp = employees.find((e) => e.id === employeeId);
  if (!emp) return { grantThisYear: 0, carryOver: 0, used: 0, remain: 0 };
  const grants = generateLeaveGrants(emp, now);
  const usages = leaveUsages.filter((u) => u.employeeId === employeeId).sort((a, b) => a.usedDate.localeCompare(b.usedDate));
  const nowDate = new Date(now);
  const nowYear = nowDate.getFullYear();

  // 付与分ごとの残数・有効期限を管理
  const grantDetails = grants.map((g) => {
    const grantDateObj = new Date(g.grantDate);
    const expireDate = new Date(g.grantDate);
    expireDate.setFullYear(expireDate.getFullYear() + 2);
    const isValid = nowDate < expireDate;
    return {
      grantDate: g.grantDate,
      grantYear: grantDateObj.getFullYear(),
      days: g.days,
      used: 0,
      remain: g.days,
      isValid,
    };
  });

  // 消化日数を付与分ごとに割り当て
  usages.forEach((u) => {
    for (const g of grantDetails) {
      if (g.isValid && g.remain > 0 && u.grantDate === g.grantDate) {
        g.used += 1;
        g.remain -= 1;
        break;
      }
    }
  });

  // 今年度付与分合計
  const grantThisYear = grantDetails.filter(g => g.isValid && g.grantYear === nowYear).reduce((sum, g) => sum + g.days, 0);
  // 繰越分（前年付与分のうち、今年度も有効な残日数）
  const carryOver = grantDetails.filter(g => g.isValid && g.grantYear === nowYear - 1).reduce((sum, g) => sum + g.remain, 0);
  // 消化日数（有効な付与分から消化された合計）
  const used = grantDetails.filter(g => g.isValid).reduce((sum, g) => sum + g.used, 0);
  // 残日数（有効な付与分の残数合計）
  const remain = grantDetails.filter(g => g.isValid).reduce((sum, g) => sum + g.remain, 0);

  return { grantThisYear, carryOver, used, remain };
}

// =============================
// 使い方例（学習用）
// =============================
// const now = "2025-06-22";
// const summary = calcLeaveSummary(1, now);
// console.log(summary);
//
// → { totalGranted: 21, totalUsed: 11, remain: 10, grants: [...], usages: [...] }
//
// これらのロジックをUIやhooksで活用し、DBテーブル参照型の有給管理を実現します。
