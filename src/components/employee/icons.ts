// =============================
// icons.ts
// アイコン・スタイル管理
// =============================
//
// 役割:
// ・アプリ全体で使うアイコン・スタイル・関数を一元管理
//
// 設計意図:
// ・UI部品の可読性・保守性向上

// ===== import: 外部ライブラリ =====
import { X, Edit, Trash2, Plus, Info, Eye } from "lucide-react";

// =============================
// アイコン・スタイル定義
// =============================

export const Icons = {
  X,
  Edit,
  Trash2,
  Plus,
  Info,
  Eye,
};

// 日付入力用のスタイル
export const inputDateStyle: React.CSSProperties = {
  border: "1px solid #B2F5EA",
  borderRadius: 6,
  padding: "6px 12px",
  fontSize: 16,
  outline: "none",
  width: "100%",
};

// 小さい日付入力用のスタイル
export const inputDateSmallStyle: React.CSSProperties = {
  border: "1px solid #B2F5EA",
  borderRadius: 6,
  padding: "4px 8px",
  fontSize: 16,
  outline: "none",
};

// =============================
// ユーティリティ関数
// =============================

// 勤続年数を「X年Yか月」形式で返す関数
// 入社日と現在日から年・月を計算し、UI表示用に整形します。
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

// =============================
// コンポーネント
// =============================
// なし
