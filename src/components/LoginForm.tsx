import React, { useState } from "react";

interface LoginFormProps {
  onLoginSuccess: (user: {
    role: string;
    employee_id: number | null;
    token: string;
  }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login_id: loginId, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "ログインに失敗しました");
      } else {
        // トークン・ユーザー情報を親に通知
        onLoginSuccess({
          role: data.role,
          employee_id: data.employee_id,
          token: data.token,
        });
      }
    } catch (e) {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 320,
        margin: "2rem auto",
        padding: 24,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <h2>ログイン</h2>
      <div style={{ marginBottom: 12 }}>
        <label>
          ログインID
          <br />
          <input
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </label>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>
          パスワード
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </label>
      </div>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
      <button type="submit" disabled={loading} style={{ width: "100%" }}>
        {loading ? "ログイン中..." : "ログイン"}
      </button>
    </form>
  );
};

export default LoginForm;
