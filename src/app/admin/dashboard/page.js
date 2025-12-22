"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import "./dashboard-content.css";

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchParams.get("error") === "unauthorized_center") {
      alert("หน้านั้นสำหรับผู้ใช้งานระดับศูนย์อพยพเท่านั้น");
    }
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>กำลังประมวลผลข้อมูล...</p>
      </div>
    );
  }

  if (!data) {
    return <div className="error-state">ไม่สามารถโหลดข้อมูลแดชบอร์ดได้</div>;
  }

  return (
    <div className="dashboard-content">
      <header className="page-header">
        <div className="header-left">
          <h1 className="page-title">แดชบอร์ดภาพรวม</h1>
          <p className="page-description">ข้อมูลสรุปสถานะการช่วยเหลือและทรัพยากรแบบ Real-time</p>
        </div>
        <div className="header-actions">
          {/* Possible quick refresh or date picker */}
        </div>
      </header>

      {/* Stats Section */}
      <div className="stats-grid">
        <StatCard title="ศูนย์ปฏิบัติการ" value={data.centersCount} icon="🏥" color="blue" />
        <StatCard title="ไอเทมในคลัง" value={data.itemsCount} icon="📦" color="purple" />
        <StatCard title="คำขอทั้งหมด" value={data.requestsCount} icon="📑" color="green" />
        <StatCard title="รอพิจารณา" value={data.pendingCount} icon="⏳" color="orange" highlight={data.pendingCount > 0} />
      </div>

      {/* Tables Section */}
      <div className="table-card">
        <div className="card-header">
          <h3>📦 รายการคำขอล่าสุด</h3>
          <button className="text-btn">ดูรายการทั้งหมด →</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>📍 ศูนย์ปฏิบัติการ</th>
                <th>🎁 สินค้าที่ต้องการ</th>
                <th>🔢 จำนวน</th>
                <th>📋 สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {data.latestRequests?.length > 0 ? (
                data.latestRequests.map((req) => (
                  <tr key={req._id}>
                    <td>{req.centerName}</td>
                    <td>{req.itemName}</td>
                    <td>{req.quantity}</td>
                    <td>
                      <span className={`status-pill ${req.status}`}>
                        {req.status === 'pending' ? 'รออนุมัติ' : req.status === 'approved' ? 'อนุมัติแล้ว' : 'ปฏิเสธ'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>ไม่พบข้อมูลคำขอ</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, highlight }) {
  return (
    <div className={`stat-card ${color} ${highlight ? 'highlight' : ''}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <p className="stat-title">{title}</p>
        <h2 className="stat-value">{value.toLocaleString()}</h2>
      </div>
    </div>
  );
}
