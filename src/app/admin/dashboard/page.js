"use client";
import { useEffect, useState } from "react";
import "./dashboard-content.css";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        <h1 className="page-title">ภาพรวมระบบ</h1>
        <p className="page-description">สรุปข้อมูลการช่วยเหลือและสถานะสินค้าบริจาค</p>
      </header>

      {/* Stats Section */}
      <div className="stats-grid">
        <StatCard title="ศูนย์ทั้งหมด" value={data.centersCount} icon="🏥" color="blue" />
        <StatCard title="สินค้าในคลัง" value={data.itemsCount} icon="📦" color="purple" />
        <StatCard title="คำขอทั้งหมด" value={data.requestsCount} icon="📑" color="green" />
        <StatCard title="รอการอนุมัติ" value={data.pendingCount} icon="⏳" color="orange" highlight={data.pendingCount > 0} />
      </div>

      {/* Tables Section */}
      <div className="dashboard-grid">
        <div className="table-card">
          <div className="card-header">
            <h3>คำขอรับบริจาคล่าสุด</h3>
            <button className="text-btn">ดูทั้งหมด →</button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ศูนย์อพยพ</th>
                  <th>สินค้า</th>
                  <th>จำนวน</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {data.latestRequests?.map((req) => (
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
                ))}
              </tbody>
            </table>
          </div>
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
