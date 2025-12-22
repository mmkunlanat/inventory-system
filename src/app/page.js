"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import "./home.css";

export default function HomePage() {
  return (
    <div className="home-container">
      <Navbar />
      {/* Background Decor */}

      <main className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            จัดการสินค้าบริจาค <br />
            <span>เพื่อช่วยเหลือได้ทันท่วงที</span>
          </h1>
          <p className="hero-subtitle">
            ระบบบริหารจัดการสินค้าคงคลังและศูนย์อพยพแบบครบวงจร
            เชื่อมต่อผู้บริจาคและผู้รับเพื่อความโปร่งใสและรวดเร็ว
          </p>
          <div className="hero-actions">
            <Link href="/admin/dashboard" className="btn-primary">แผงควบคุมแอดมิน</Link>
            <Link href="/center/request" className="btn-secondary">ขอรับบริจาคสำหรับศูนย์</Link>
          </div>
        </div>

        <div className="hero-features">
          <div className="feature-card">
            <div className="f-icon">🏥</div>
            <h3>940+ ศูนย์อพยพ</h3>
            <p>ลงทะเบียนครอบคลุมทุกพื้นที่เสี่ยงภัย</p>
          </div>
          <div className="feature-card">
            <div className="f-icon">📦</div>
            <h3>จัดการ Inventory</h3>
            <p>ติดตามสถานะสินค้าคงคลังแบบ Real-time</p>
          </div>
          <div className="feature-card">
            <div className="f-icon">⚡</div>
            <h3>อนุมัติรวดเร็ว</h3>
            <p>ระบบอนุมัติคำขอภายในไม่กี่นาที</p>
          </div>
        </div>
      </main>

      <footer className="home-footer">
        <p>© 2025 RescueSync Platform. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
