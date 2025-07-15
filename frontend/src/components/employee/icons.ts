
// =====================================================
// icons.ts
// -----------------------------------------------------
// 【有給休暇管理アプリ】従業員・UI用アイコン定義・ユーティリティ
// -----------------------------------------------------
// ▼主な役割
//   - アイコン定義・ユーティリティ関数の提供
// ▼設計意図
//   - UI部品の共通化・再利用性向上
// ▼使い方
//   - 各コンポーネントでimportして利用
// =====================================================

// ===== import: 外部ライブラリ =====

import { X, Edit, Trash2, Plus, Info, Eye, Loader, Sun, Moon } from "lucide-react";


// ===============================
// ▼アイコン・スタイル定義
// ===============================

export const Icons = {
  X,
  Edit,
  Trash2,
  Plus,
  Info,
  Eye,
  Loader,
  Sun,
  Moon,
};

// =============================

// ===============================
// ▼ユーティリティ関数
// ===============================

/**
 * 勤続年数を「X年Yか月」形式で返す関数
 * 入社日と現在日から年・月を計算し、UI表示用に整形
 */
export function getServicePeriod(joinedAt: string, now: Date = new Date()): string {
  // YYYY-MM-DDまたはYYYY-MM形式に対応
  const match = joinedAt.match(/^\d{4}-(\d{2})(?:-(\d{2}))?$/);
  if (!match) return "-";
  const year = Number(joinedAt.slice(0, 4));
  const month = Number(joinedAt.slice(5, 7));
  const day = joinedAt.length >= 10 ? Number(joinedAt.slice(8, 10)) : 1;
  const joinDate = new Date(year, month - 1, day);
  if (joinDate > now) return "-";
  let years = now.getFullYear() - year;
  let months = now.getMonth() - (month - 1);
  let days = now.getDate() - day;
  if (days < 0) {
    months--;
    // 前月の日数を加算
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  if (years < 0) return "-";
  return `${years}年${months}か月`;
}
