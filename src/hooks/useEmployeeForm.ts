import { useState } from "react";
import type { Employee } from "../components/employee/types";
import { calcLeaveDays } from "../components/employee/utils";

export function useEmployeeForm(initial: Employee, employees: Employee[], activeEmployeeId: string | null) {
  const [form, setForm] = useState<Employee>(initial);
  const [idError, setIdError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "id") {
      setForm((prev) => ({ ...prev, id: value }));
      if (value && !/^[0-9]*$/.test(value)) {
        setIdError("従業員コードは半角数字のみ入力できます");
      } else if (
        value &&
        employees.some(
          (emp) => emp.id === value && (activeEmployeeId === null || emp.id !== activeEmployeeId)
        )
      ) {
        setIdError("従業員コードが重複しています");
      } else if (!value) {
        setIdError("従業員コードは必須です");
      } else {
        setIdError("");
      }
      return;
    }
    setForm((prev) => {
      let next = {
        ...prev,
        [name]: name === "total" || name === "used" ? Number(value) : value,
      };
      if (name === "joinedAt") {
        next.total = calcLeaveDays(value);
      }
      return next;
    });
  };

  return { form, setForm, idError, setIdError, handleChange };
}
