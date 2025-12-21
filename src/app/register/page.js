"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("center");

  const register = async () => {
    await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role })
    });

    alert("สมัครสมาชิกสำเร็จ");
    router.push("/login");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h3 className="mb-3">สมัครสมาชิก</h3>

      <input
        className="form-control mb-2"
        placeholder="Username"
        onChange={e => setUsername(e.target.value)}
      />

      <input
        type="password"
        className="form-control mb-2"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />

      <select
        className="form-control mb-3"
        onChange={e => setRole(e.target.value)}
      >
        <option value="center">ศูนย์อพยพ</option>
        <option value="admin">ผู้ดูแลระบบ</option>
      </select>

      <button className="btn btn-success w-100" onClick={register}>
        สมัครสมาชิก
      </button>
    </div>
  );
}

