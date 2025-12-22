"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import "./center-request.css";

export default function CenterRequest() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    centerName: "",
    itemName: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (searchParams.get("error") === "unauthorized_admin") {
      setMessage({ type: "error", text: "คุณไม่มีสิทธิ์เข้าถึงหน้า Admin Dashboard กรุณาเข้าสู่ระบบด้วยสิทธิ์ผู้ดูแลระบบ" });
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "ส่งคำขอรับบริจาคเรียบร้อยแล้ว แอดมินจะดำเนินการโดยเร็วที่สุด" });
        setFormData({ ...formData, itemName: "", quantity: "" });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "เกิดข้อผิดพลาดในการส่งคำขอ" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-page-wrapper">
      <Navbar />

      <main className="center-main">
        <div className="request-card">
          <header className="request-header">
            <h1 className="title">ขอรับสินค้าบริจาค</h1>
            <p className="subtitle">กรอกข้อมูลความต้องการของศูนย์ช่วยเหลือเพื่อให้แอดมินจัดสรรสินค้าให้</p>
          </header>

          {message && (
            <div className={`alert-msg ${message.type}`}>
              {message.type === 'success' ? '✅' : '❌'} {message.text}
            </div>
          )}

          <form className="request-form" onSubmit={submitRequest}>
            <div className="form-group">
              <label>ชื่อศูนย์อพยพ / หน่วยงาน</label>
              <input
                name="centerName"
                placeholder="ระบุชื่อศูนย์ของคุณ"
                value={formData.centerName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>สินค้าที่ต้องการ</label>
                <input
                  name="itemName"
                  placeholder="เช่น ข้าวสาร, น้ำดื่ม"
                  value={formData.itemName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group q-input">
                <label>จำนวน</label>
                <input
                  name="quantity"
                  type="number"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-request-btn" disabled={loading}>
              {loading ? "กำลังส่งคำขอ..." : "ส่งคำขอยืนยัน"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
