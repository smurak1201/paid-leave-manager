// =============================
// sampleData/employees.ts
// サンプル従業員データ（初期値）
// =============================
//
// 役割:
// ・アプリ全体で使う初期従業員データを一元管理
//
// 設計意図:
// ・実運用時はAPI/DBから取得する想定
// ・型安全性のためEmployee型を利用
// ・集計値（消化日数・残日数・繰越など）は持たず、付与履歴と取得日だけを保持
//   → 集計値はフロントエンドで都度計算

// ===== import: 型定義 =====
import type { Employee } from "../components/employee/types";

// ===== 初期従業員データ =====
export const initialEmployees: Employee[] = [
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
