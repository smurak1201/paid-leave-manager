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
}

// サンプルデータ例（grantDateを削除）
export const leaveUsages: LeaveUsage[] = [
  // 山田: 有効分（2024-08-15付与分から2日消化）、無効分（2022-08-15付与分から11日消化）
  { id: 1, employeeId: 1, usedDate: "2022-09-01" }, // 無効
  { id: 2, employeeId: 1, usedDate: "2022-10-01" }, // 無効
  { id: 3, employeeId: 1, usedDate: "2022-11-01" }, // 無効
  { id: 4, employeeId: 1, usedDate: "2022-12-01" }, // 無効
  { id: 5, employeeId: 1, usedDate: "2023-01-01" }, // 無効
  { id: 6, employeeId: 1, usedDate: "2023-02-01" }, // 無効
  { id: 7, employeeId: 1, usedDate: "2023-03-01" }, // 無効
  { id: 8, employeeId: 1, usedDate: "2023-04-01" }, // 無効
  { id: 9, employeeId: 1, usedDate: "2023-05-01" }, // 無効
  { id: 10, employeeId: 1, usedDate: "2023-06-01" }, // 無効
  { id: 11, employeeId: 1, usedDate: "2023-07-01" }, // 無効
  { id: 101, employeeId: 1, usedDate: "2024-09-01" }, // 有効
  { id: 102, employeeId: 1, usedDate: "2024-10-01" }, // 有効

  // 佐藤: 有効分（2024-01-01付与分から2日消化）、無効分（2023-01-01付与分から2日消化）
  { id: 12, employeeId: 2, usedDate: "2023-02-01" }, // 無効
  { id: 13, employeeId: 2, usedDate: "2023-06-01" }, // 無効
  { id: 103, employeeId: 2, usedDate: "2024-01-10" }, // 有効
  { id: 104, employeeId: 2, usedDate: "2024-01-11" }, // 有効

  // 田中: 有効分（2024-05-20付与分から1日消化）、無効分なし
  { id: 27, employeeId: 3, usedDate: "2024-06-10" }, // 有効

  // 鈴木: 有効分なし、無効分（2022-12-10付与分から2日消化）
  { id: 29, employeeId: 4, usedDate: "2023-01-10" }, // 無効
  { id: 30, employeeId: 4, usedDate: "2023-02-10" }, // 無効

  // 高橋: 有効分（2024-10-01付与分から1日消化）、無効分なし
  { id: 105, employeeId: 5, usedDate: "2024-11-01" }, // 有効

  // 伊藤: 有効分（2024-07-15付与分から2日消化）、無効分なし
  { id: 31, employeeId: 6, usedDate: "2024-08-01" }, // 有効
  { id: 32, employeeId: 6, usedDate: "2024-08-15" }, // 有効

  // 渡辺: 有効分なし、無効分（2021-04-01付与分から2日消化）
  { id: 41, employeeId: 7, usedDate: "2022-05-01" }, // 無効
  { id: 42, employeeId: 7, usedDate: "2022-07-10" }, // 無効

  // 中村: 有効分（2024-10-10付与分から1日消化）、無効分なし
  { id: 106, employeeId: 8, usedDate: "2024-11-01" }, // 有効

  // 小林: 有効分なし、無効分なし

  // 加藤: 有効分（2024-09-01付与分から1日消化）、無効分なし
  { id: 107, employeeId: 10, usedDate: "2024-09-10" }, // 有効

  // 吉田: 有効分なし、無効分なし

  // 山本: 有効分（2024-12-01付与分から1日消化）、無効分なし
  { id: 108, employeeId: 12, usedDate: "2024-12-10" }, // 有効

  // 斎藤: 有効分なし、無効分（2021-02-15付与分から1日消化）
  { id: 109, employeeId: 13, usedDate: "2022-03-10" }, // 無効

  // 森田: 有効分（2024-12-10付与分から1日消化）、無効分なし
  { id: 110, employeeId: 14, usedDate: "2024-12-20" }, // 有効

  // 石井: 有効分なし、無効分なし

  // 上田: 有効分（2024-11-11付与分から1日消化）、無効分（2022-11-11付与分から1日消化）
  { id: 111, employeeId: 16, usedDate: "2022-12-11" }, // 無効
  { id: 112, employeeId: 16, usedDate: "2024-12-11" }, // 有効
];

// =============================
// 有給付与日数算出・付与履歴・残日数集計ロジック例
// =============================

/**
 * 勤続年数（月単位）を正確に計算（年・月・日を考慮）
 * @param joinedAt 入社日（YYYY-MM-DD）
 * @param now 現在日付（YYYY-MM-DD）
 * @returns 勤続月数
 */
export function calcMonthsOfService(joinedAt: string, now: string): number {
  const [jy, jm, jd] = joinedAt.split("-").map(Number);
  const [ny, nm, nd] = now.split("-").map(Number);
  let months = (ny - jy) * 12 + (nm - jm);
  if (nd < jd) months -= 1; // 今月の日が入社日より前なら1か月引く
  return months;
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
  const [jy, jm, jd] = employee.joinedAt.split('-').map(Number); // ← 日も取得
  for (let i = 0; i < leaveGrantMaster.length; i++) {
    const master = leaveGrantMaster[i];
    // 年月を合算して日付を生成（setMonth/setFullYearの副作用回避）
    let y = jy + master.years;
    let m = jm + master.months;
    // 月が12を超えた場合の年繰り上げ処理
    if (m > 12) {
      y += Math.floor((m - 1) / 12);
      m = ((m - 1) % 12) + 1;
    }
    // 日付は入社日と同じ日（jd）で固定
    const date = new Date(y, m - 1, jd);
    if (date > new Date(now)) continue;
    grants.push({ grantDate: date.toISOString().slice(0, 10), days: master.days });
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
  const nowDate = new Date(now);
  let totalGranted = 0, totalUsed = 0;
  grants.forEach(g => {
    // 有効期限（付与日＋2年）未満のみ集計
    const expire = new Date(g.grantDate);
    expire.setFullYear(expire.getFullYear() + 2);
    if (nowDate < expire) {
      totalGranted += g.days;
      // grantDate一致→有効期間内usedDateに修正
      const used = usages.filter(u => u.usedDate >= g.grantDate && u.usedDate < expire.toISOString().slice(0, 10)).length;
      totalUsed += used;
    }
  });
  return {
    totalGranted,
    totalUsed,
    remain: totalGranted - totalUsed,
    grants: grants.filter(g => {
      const expire = new Date(g.grantDate);
      expire.setFullYear(expire.getFullYear() + 2);
      return nowDate < expire;
    }),
    usages: usages.filter(u => {
      // 有効な付与分の消化履歴のみ返す
      return grants.some(g => {
        const expire = new Date(g.grantDate);
        expire.setFullYear(expire.getFullYear() + 2);
        return u.usedDate >= g.grantDate && u.usedDate < expire.toISOString().slice(0, 10);
      });
    })
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
  const nowDate = new Date(now);
  return grants
    .filter(g => {
      // 有効期限（付与日＋2年）未満のみ表示
      const expire = new Date(g.grantDate);
      expire.setFullYear(expire.getFullYear() + 2);
      return nowDate < expire;
    })
    .map(g => {
      const expire = new Date(g.grantDate);
      expire.setFullYear(expire.getFullYear() + 2);
      // grantDate一致→有効期間内usedDateに修正
      const usedDates = usages.filter(u => u.usedDate >= g.grantDate && u.usedDate < expire.toISOString().slice(0, 10)).map(u => u.usedDate).sort();
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
  now: string = APP_LAUNCH_DATE
) {
  const emp = employees.find((e) => e.id === employeeId);
  if (!emp) return { grantThisYear: 0, carryOver: 0, used: 0, remain: 0 };
  const grants = generateLeaveGrants(emp, now);
  const nowDate = new Date(now);
  // usagesは従業員IDのみで抽出
  const usages = leaveUsages.filter((u) => u.employeeId === employeeId).sort((a, b) => a.usedDate.localeCompare(b.usedDate));

  // 直近の付与日・次回付与日を特定
  let thisGrant = null;
  for (let i = 0; i < grants.length; i++) {
    const grantDate = new Date(grants[i].grantDate);
    const next = grants[i + 1] ? new Date(grants[i + 1].grantDate) : null;
    if (grantDate <= nowDate && (!next || nowDate < next)) {
      thisGrant = grants[i];
      break;
    }
  }

  // 直近の付与日（今が付与日以降のうち最新）
  const validGrants = grants.filter(g => new Date(g.grantDate) <= nowDate);
  thisGrant = validGrants.length > 0 ? validGrants[validGrants.length - 1] : null;

  // 今年度付与分
  const grantThisYear = thisGrant ? thisGrant.days : 0;

  // 繰越分（前回付与分のうち、今年度も有効な残日数）
  let carryOver = 0;
  if (validGrants.length >= 2 && thisGrant) {
    const prevGrant = validGrants[validGrants.length - 2];
    // 有効期限内かつ、今年度開始時点で残っている分
    const prevGrantExpire = new Date(prevGrant.grantDate);
    prevGrantExpire.setFullYear(prevGrantExpire.getFullYear() + 2);
    if (nowDate < prevGrantExpire) {
      // 前回付与分の消化数
      const usedPrev = usages.filter(u => u.usedDate >= prevGrant.grantDate && u.usedDate < thisGrant.grantDate).length;
      carryOver = prevGrant.days - usedPrev;
    }
  }

  // 全有効分の消化日数・残日数
  const grantDetails = grants.map((g) => {
    const expireDate = new Date(g.grantDate);
    expireDate.setFullYear(expireDate.getFullYear() + 2);
    const isValid = nowDate < expireDate;
    // grantDate一致→有効期間内usedDateに修正
    const used = usages.filter(u => u.usedDate >= g.grantDate && u.usedDate < expireDate.toISOString().slice(0, 10)).length;
    return {
      grantDate: g.grantDate,
      days: g.days,
      used,
      remain: g.days - used,
      isValid,
    };
  }).filter(g => g.isValid);
  const used = grantDetails.reduce((sum, g) => sum + g.used, 0);
  const remain = grantDetails.reduce((sum, g) => sum + g.remain, 0);

  // デバッグ用: 付与履歴と消化履歴を出力（山田太郎のみ）
  if (employeeId === 1) {
    console.log('【DEBUG】山田太郎 grants:', grants);
    console.log('【DEBUG】山田太郎 usages:', usages);
    console.log('【DEBUG】山田太郎 grantDetails:', grantDetails);
  }

  return { grantThisYear, carryOver, used, remain };
}

// アプリ起動時の基準日を一度だけ決定し、以降はこの値を使う
export const APP_LAUNCH_DATE = new Date().toISOString().slice(0, 10);

export function getEmployeeSummaryList(
  now: string = APP_LAUNCH_DATE
) {
  return employees.map(emp => {
    // 勤続年数
    const months = calcMonthsOfService(emp.joinedAt, now);
    const years = Math.floor(months / 12);
    const restMonths = months % 12;
    // 有給集計
    const summary = getEmployeeLeaveSummary(emp.id, leaveUsages, employees, now);
    // 現時点での付与日数（法定マスタ参照）
    const grantDays = getCurrentGrantDays(emp.joinedAt, now);
    return {
      ...emp,
      years,
      months: restMonths,
      remain: summary.remain,
      used: summary.used,
      grantThisYear: summary.grantThisYear,
      carryOver: summary.carryOver,
      grantDays, // ← 追加
    };
  });
}

/**
 * 現時点での付与日数を返す（最新の付与分のdaysを返す）
 * @param joinedAt 入社年月日（YYYY-MM-DD）
 * @param now 現在日付（YYYY-MM-DD、省略時は今日）
 * @returns 付与日数
 */
export function getCurrentGrantDays(joinedAt: string, now: string = new Date().toISOString().slice(0, 10)) {
  const grants = generateLeaveGrants({ joinedAt }, now);
  if (grants.length === 0) return 0;
  return grants[grants.length - 1].days;
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
