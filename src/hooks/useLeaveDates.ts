import { useState } from "react";
import type { Employee } from "../components/employee/types";

export function useLeaveDates(employee: Employee | null) {
  const [editDateIdx, setEditDateIdx] = useState<number | null>(null);
  const [dateInput, setDateInput] = useState<string>("");

  const handleAddDate = (date: string, onUpdate: (dates: string[]) => void) => {
    if (!employee) return;
    const newDate = date;
    if (
      !newDate.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) ||
      employee.leaveDates.includes(newDate) ||
      newDate < employee.joinedAt
    )
      return;
    onUpdate([...employee.leaveDates, newDate]);
    setDateInput("");
  };

  const handleEditDate = (idx: number) => {
    if (!employee) return;
    setEditDateIdx(idx);
    setDateInput(employee.leaveDates[idx]);
  };

  const handleSaveDate = (onUpdate: (dates: string[]) => void) => {
    if (!employee || editDateIdx === null) return;
    const newDate = dateInput;
    if (
      !newDate.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) ||
      employee.leaveDates.includes(newDate) ||
      newDate < employee.joinedAt
    )
      return;
    onUpdate(
      employee.leaveDates.map((d, i) => (i === editDateIdx ? newDate : d))
    );
    setEditDateIdx(null);
    setDateInput("");
  };

  const handleDeleteDate = (idx: number, onUpdate: (dates: string[]) => void) => {
    if (!employee) return;
    onUpdate(employee.leaveDates.filter((_, i) => i !== idx));
    setEditDateIdx(null);
    setDateInput("");
  };

  return {
    editDateIdx,
    setEditDateIdx,
    dateInput,
    setDateInput,
    handleAddDate,
    handleEditDate,
    handleSaveDate,
    handleDeleteDate,
  };
}
