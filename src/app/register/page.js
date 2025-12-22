"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./register.css";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "center",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่");
      } else {
        router.push("/login?registered=true");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="register-container">
      <div className="bg-circles">
        <div className="circle c1"></div>
        <div className="circle c2"></div>
      </div>

      <div className="register-card">
        <div className="card-header">
          <div className="logo-circle">🆘</div>
          <h1>สมัครสมาชิกใหม่</h1>
          <p>เข้าเป็นส่วนหนึ่งของเครือข่ายความช่วยเหลือ</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">ชื่อผู้ใช้งาน</label>
            <div className="input-box">
              <input
                type="text"
                name="username"
                placeholder="ตั้งชื่อผู้ใช้งาน..."
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">รหัสผ่าน</label>
            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="กำหนดรหัสผ่าน..."
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">บทบาทผู้ใช้งาน</label>
            <div className="input-box">
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="center">ศูนย์อพยพ / ศูนย์ช่วยเหลือ</option>
                <option value="admin">ผู้ดูแลระบบคลังสินค้า</option>
              </select>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "กำลังบันทึก..." : "ยืนยันการสมัครสมาชิก"}
          </button>
        </form>

        <div className="card-footer">
          <span>มีบัญชีผู้ใช้อยู่แล้ว?</span>
          <Link href="/login" className="login-link">
            เข้าสู่ระบบเลย
          </Link>
        </div>
      </div>
    </div>
  );
}
