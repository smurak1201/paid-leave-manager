import { X, Edit, Trash2, Plus, Info, Eye } from "lucide-react";

export const Icons = {
  X,
  Edit,
  Trash2,
  Plus,
  Info,
  Eye,
};

export const inputDateStyle: React.CSSProperties = {
  border: "1px solid #B2F5EA",
  borderRadius: 6,
  padding: "6px 12px",
  fontSize: 16,
  outline: "none",
  width: "100%",
};

export const inputDateSmallStyle: React.CSSProperties = {
  border: "1px solid #B2F5EA",
  borderRadius: 6,
  padding: "4px 8px",
  fontSize: 16,
  outline: "none",
};

// 勤続年数を「X年Yか月」形式で返す（YYYY-MM-DD対応・正確な計算）
export function getServicePeriod(joinedAt: string, now: Date = new Date()): string {
  // YYYY-MM-DDまたはYYYY-MM形式に対応
  const match = joinedAt.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  if (!match) return "-";
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = match[3] ? Number(match[3]) : 1;
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
