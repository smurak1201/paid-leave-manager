// =============================
// sampleData/employees.ts
// サンプル従業員データ（初期値）
// =============================
//
// アプリ全体で使う初期従業員データを一元管理します。
// - 実運用時はAPI等で取得する想定
// - 型安全性のためEmployee型を利用

import type { Employee } from "../components/employee/types";

export const initialEmployees: Employee[] = [
  // 1人目: 山田 太郎
  {
    id: 1,
    lastName: "山田",
    firstName: "太郎",
    joinedAt: "2021-02-15",
    grants: [
      {
        grantDate: "2022-02-15",
        days: 12,
        usedDates: [
          "2022-03-01",
          "2022-04-01",
          "2022-05-01",
          "2022-06-01",
          "2022-07-01",
          "2022-08-01",
          "2022-09-01",
          "2022-10-01",
          "2022-11-01",
          "2022-12-01",
          "2023-01-01",
        ],
      },
      { grantDate: "2023-02-15", days: 14, usedDates: [] },
      { grantDate: "2024-02-15", days: 16, usedDates: [] },
    ],
    total: 42,
    used: 11,
    leaveDates: [
      "2022-03-01",
      "2022-04-01",
      "2022-05-01",
      "2022-06-01",
      "2022-07-01",
      "2022-08-01",
      "2022-09-01",
      "2022-10-01",
      "2022-11-01",
      "2022-12-01",
      "2023-01-01",
    ],
    carryOver: 0,
  },
  // 2人目: 佐藤 花子
  {
    id: 2,
    lastName: "佐藤",
    firstName: "花子",
    joinedAt: "2022-07-01",
    grants: [
      {
        grantDate: "2023-07-01",
        days: 14,
        usedDates: ["2023-08-01", "2023-12-01"],
      },
      { grantDate: "2024-07-01", days: 16, usedDates: ["2024-08-01"] },
    ],
    total: 30,
    used: 3,
    leaveDates: ["2023-08-01", "2023-12-01", "2024-08-01"],
    carryOver: 0,
  },
  // 3人目: 田中 一郎
  {
    id: 3,
    lastName: "田中",
    firstName: "一郎",
    joinedAt: "2023-11-20",
    grants: [{ grantDate: "2024-11-20", days: 16, usedDates: [] }],
    total: 16,
    used: 0,
    leaveDates: [],
    carryOver: 0,
  },
  // 4人目: 鈴木 美咲
  {
    id: 4,
    lastName: "鈴木",
    firstName: "美咲",
    joinedAt: "2021-06-10",
    grants: [
      { grantDate: "2022-06-10", days: 12, usedDates: ["2022-07-01"] },
      {
        grantDate: "2023-06-10",
        days: 14,
        usedDates: ["2023-07-01", "2023-08-01", "2023-09-01"],
      },
      { grantDate: "2024-06-10", days: 16, usedDates: ["2024-07-01"] },
    ],
    total: 42,
    used: 5,
    leaveDates: [
      "2022-07-01",
      "2023-07-01",
      "2023-08-01",
      "2023-09-01",
      "2024-07-01",
    ],
    carryOver: 0,
  },
  // 5人目: 高橋 健
  {
    id: 5,
    lastName: "高橋",
    firstName: "健",
    joinedAt: "2020-04-01",
    grants: [
      { grantDate: "2021-04-01", days: 10, usedDates: ["2021-05-10"] },
      {
        grantDate: "2022-04-01",
        days: 12,
        usedDates: ["2022-06-15", "2022-09-20"],
      },
      { grantDate: "2023-04-01", days: 14, usedDates: ["2023-07-01"] },
      { grantDate: "2024-04-01", days: 16, usedDates: [] },
    ],
    total: 52,
    used: 4,
    leaveDates: ["2021-05-10", "2022-06-15", "2022-09-20", "2023-07-01"],
    carryOver: 2,
  },
  // 6人目: 伊藤 彩
  {
    id: 6,
    lastName: "伊藤",
    firstName: "彩",
    joinedAt: "2022-01-15",
    grants: [
      { grantDate: "2023-01-15", days: 14, usedDates: ["2023-02-10"] },
      { grantDate: "2024-01-15", days: 16, usedDates: ["2024-03-05"] },
    ],
    total: 30,
    used: 2,
    leaveDates: ["2023-02-10", "2024-03-05"],
    carryOver: 0,
  },
  // 7人目: 渡辺 大輔
  {
    id: 7,
    lastName: "渡辺",
    firstName: "大輔",
    joinedAt: "2019-10-01",
    grants: [
      { grantDate: "2020-10-01", days: 10, usedDates: ["2020-11-01"] },
      { grantDate: "2021-10-01", days: 12, usedDates: ["2021-12-01"] },
      { grantDate: "2022-10-01", days: 14, usedDates: ["2022-11-01"] },
      { grantDate: "2023-10-01", days: 16, usedDates: ["2023-12-01"] },
      { grantDate: "2024-10-01", days: 18, usedDates: [] },
    ],
    total: 70,
    used: 4,
    leaveDates: ["2020-11-01", "2021-12-01", "2022-11-01", "2023-12-01"],
    carryOver: 5,
  },
  // 8人目: 中村 さくら
  {
    id: 8,
    lastName: "中村",
    firstName: "さくら",
    joinedAt: "2023-04-10",
    grants: [{ grantDate: "2024-04-10", days: 16, usedDates: ["2024-05-20"] }],
    total: 16,
    used: 1,
    leaveDates: ["2024-05-20"],
    carryOver: 0,
  },
  // 9人目: 小林 直樹
  {
    id: 9,
    lastName: "小林",
    firstName: "直樹",
    joinedAt: "2020-12-01",
    grants: [
      { grantDate: "2021-12-01", days: 12, usedDates: ["2022-01-10"] },
      { grantDate: "2022-12-01", days: 14, usedDates: ["2023-02-15"] },
      { grantDate: "2023-12-01", days: 16, usedDates: [] },
    ],
    total: 42,
    used: 2,
    leaveDates: ["2022-01-10", "2023-02-15"],
    carryOver: 1,
  },
  // 10人目: 加藤 美優
  {
    id: 10,
    lastName: "加藤",
    firstName: "美優",
    joinedAt: "2022-09-01",
    grants: [
      { grantDate: "2023-09-01", days: 14, usedDates: ["2023-10-01"] },
      { grantDate: "2024-09-01", days: 16, usedDates: [] },
    ],
    total: 30,
    used: 1,
    leaveDates: ["2023-10-01"],
    carryOver: 0,
  },
  // 11人目: 吉田 翔
  {
    id: 11,
    lastName: "吉田",
    firstName: "翔",
    joinedAt: "2021-03-20",
    grants: [
      { grantDate: "2022-03-20", days: 12, usedDates: ["2022-04-10"] },
      { grantDate: "2023-03-20", days: 14, usedDates: ["2023-05-01"] },
      { grantDate: "2024-03-20", days: 16, usedDates: [] },
    ],
    total: 42,
    used: 2,
    leaveDates: ["2022-04-10", "2023-05-01"],
    carryOver: 0,
  },
  // 12人目: 山本 里奈
  {
    id: 12,
    lastName: "山本",
    firstName: "里奈",
    joinedAt: "2023-06-01",
    grants: [{ grantDate: "2024-06-01", days: 16, usedDates: [] }],
    total: 16,
    used: 0,
    leaveDates: [],
    carryOver: 0,
  },
  // 13人目: 斎藤 拓海
  {
    id: 13,
    lastName: "斎藤",
    firstName: "拓海",
    joinedAt: "2020-08-15",
    grants: [
      { grantDate: "2021-08-15", days: 12, usedDates: ["2021-09-01"] },
      { grantDate: "2022-08-15", days: 14, usedDates: ["2022-10-01"] },
      { grantDate: "2023-08-15", days: 16, usedDates: ["2023-11-01"] },
      { grantDate: "2024-08-15", days: 18, usedDates: [] },
    ],
    total: 60,
    used: 3,
    leaveDates: ["2021-09-01", "2022-10-01", "2023-11-01"],
    carryOver: 2,
  },
  // 14人目: 森田 さやか
  {
    id: 14,
    lastName: "森田",
    firstName: "さやか",
    joinedAt: "2021-12-10",
    grants: [
      { grantDate: "2022-12-10", days: 14, usedDates: ["2023-01-10"] },
      { grantDate: "2023-12-10", days: 16, usedDates: [] },
    ],
    total: 30,
    used: 1,
    leaveDates: ["2023-01-10"],
    carryOver: 0,
  },
  // 15人目: 石井 亮
  {
    id: 15,
    lastName: "石井",
    firstName: "亮",
    joinedAt: "2022-03-01",
    grants: [
      { grantDate: "2023-03-01", days: 14, usedDates: ["2023-04-01"] },
      { grantDate: "2024-03-01", days: 16, usedDates: ["2024-04-01"] },
    ],
    total: 30,
    used: 2,
    leaveDates: ["2023-04-01", "2024-04-01"],
    carryOver: 0,
  },
  // 16人目: 上田 美穂
  {
    id: 16,
    lastName: "上田",
    firstName: "美穂",
    joinedAt: "2020-11-11",
    grants: [
      { grantDate: "2021-11-11", days: 12, usedDates: ["2022-01-11"] },
      { grantDate: "2022-11-11", days: 14, usedDates: ["2023-01-11"] },
      { grantDate: "2023-11-11", days: 16, usedDates: [] },
    ],
    total: 42,
    used: 2,
    leaveDates: ["2022-01-11", "2023-01-11"],
    carryOver: 1,
  },
];
