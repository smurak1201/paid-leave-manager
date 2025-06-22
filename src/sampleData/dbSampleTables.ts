// =============================
// sampleData/dbSampleTables.ts
// バックエンドDBテーブルを想定したサンプルデータ集約
// =============================
//
// ・従業員テーブル: id, lastName, firstName, joinedAt
// ・有給付与テーブル: grantId, employeeId, grantDate
// ・有給消化テーブル: usedId, employeeId, usedDate, grantId(消化元付与)

// ===== 従業員テーブル =====
export const employees = [
  { id: 1, lastName: "山田", firstName: "太郎", joinedAt: "2021-02-15" },
  { id: 2, lastName: "佐藤", firstName: "花子", joinedAt: "2022-07-01" },
  { id: 3, lastName: "田中", firstName: "一郎", joinedAt: "2023-11-20" },
  { id: 4, lastName: "鈴木", firstName: "美咲", joinedAt: "2021-06-10" },
  { id: 5, lastName: "高橋", firstName: "健", joinedAt: "2020-04-01" },
  { id: 6, lastName: "伊藤", firstName: "彩", joinedAt: "2022-01-15" },
  { id: 7, lastName: "渡辺", firstName: "大輔", joinedAt: "2019-10-01" },
  { id: 8, lastName: "中村", firstName: "さくら", joinedAt: "2023-04-10" },
  { id: 9, lastName: "小林", firstName: "直樹", joinedAt: "2020-12-01" },
  { id: 10, lastName: "加藤", firstName: "美優", joinedAt: "2022-09-01" },
  { id: 11, lastName: "吉田", firstName: "翔", joinedAt: "2021-03-20" },
  { id: 12, lastName: "山本", firstName: "里奈", joinedAt: "2023-06-01" },
  { id: 13, lastName: "斎藤", firstName: "拓海", joinedAt: "2020-08-15" },
  { id: 14, lastName: "森田", firstName: "さやか", joinedAt: "2021-12-10" },
  { id: 15, lastName: "石井", firstName: "亮", joinedAt: "2022-03-01" },
  { id: 16, lastName: "上田", firstName: "美穂", joinedAt: "2020-11-11" },
];

// ===== 有給付与テーブル =====
export const leaveGrants = [
  // grantId, employeeId, grantDate
  { grantId: 1, employeeId: 1, grantDate: "2022-02-15" },
  { grantId: 2, employeeId: 1, grantDate: "2023-02-15" },
  { grantId: 3, employeeId: 1, grantDate: "2024-02-15" },
  { grantId: 4, employeeId: 2, grantDate: "2023-07-01" },
  { grantId: 5, employeeId: 2, grantDate: "2024-07-01" },
  { grantId: 6, employeeId: 3, grantDate: "2024-05-20" },
  { grantId: 7, employeeId: 4, grantDate: "2022-06-10" },
  { grantId: 8, employeeId: 4, grantDate: "2023-06-10" },
  { grantId: 9, employeeId: 4, grantDate: "2024-06-10" },
  // ...必要に応じて追加...
];

// ===== 有給消化テーブル =====
export const leaveUsages = [
  // usedId, employeeId, usedDate, grantId
  { usedId: 1, employeeId: 1, usedDate: "2022-03-01", grantId: 1 },
  { usedId: 2, employeeId: 1, usedDate: "2022-04-01", grantId: 1 },
  { usedId: 3, employeeId: 1, usedDate: "2022-05-01", grantId: 1 },
  { usedId: 4, employeeId: 1, usedDate: "2022-06-01", grantId: 1 },
  { usedId: 5, employeeId: 1, usedDate: "2022-07-01", grantId: 1 },
  { usedId: 6, employeeId: 1, usedDate: "2022-08-01", grantId: 1 },
  { usedId: 7, employeeId: 1, usedDate: "2022-09-01", grantId: 1 },
  { usedId: 8, employeeId: 1, usedDate: "2022-10-01", grantId: 1 },
  { usedId: 9, employeeId: 1, usedDate: "2022-11-01", grantId: 1 },
  { usedId: 10, employeeId: 1, usedDate: "2022-12-01", grantId: 1 },
  { usedId: 11, employeeId: 1, usedDate: "2023-01-01", grantId: 1 },
  // ...必要に応じて追加...
];
