"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const login = () => {
    if (username === "admin") {
      sessionStorage.setItem("role", "admin");
      router.push("/admin/items");
    } else {
      sessionStorage.setItem("role", "center");
      router.push("/center/request");
    }
  };

  return (
    <div className="container mt-5">
      <h3>เข้าสู่ระบบ</h3>

      <input
        className="form-control mb-2"
        placeholder="ชื่อผู้ใช้"
        onChange={e => setUsername(e.target.value)}
      />

      <button className="btn btn-primary" onClick={login}>
        เข้าสู่ระบบ
      </button>

      <p className="mt-3 text-muted">
        admin = ผู้ดูแลระบบ | อื่น ๆ = ศูนย์อพยพ
      </p>
    </div>
  );
}
