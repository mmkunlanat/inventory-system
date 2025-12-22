"use client";
import { useEffect, useState } from "react";
import "../dashboard/dashboard-content.css";


export default function AdminRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const res = await fetch("/api/requests");
    const data = await res.json();
    setRequests(data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    await fetch("/api/requests", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchRequests();
  };

  return (
    <div className="dashboard-content">
      <header className="page-header">
        <div className="header-left">
          <h1 className="page-title">📑 คำขอรับบริจาค</h1>
          <p className="page-description">ตรวจสอบและพิจารณาอนุมัติการกระจายสินค้าไปยังศูนย์อพยพต่างๆ</p>
        </div>
      </header>

      <div className="table-card">
        <div className="card-header">
          <h3>รายการคำขอรับการช่วยเหลือ</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>🏥 ศูนย์อพยพ</th>
                <th>🎁 สินค้า</th>
                <th>🔢 จำนวน</th>
                <th>📋 สถานะ</th>
                <th>⚙️ จัดการคำขอ</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id}>
                  <td style={{ fontWeight: '700' }}>{r.centerName}</td>
                  <td style={{ fontWeight: '600', color: 'var(--primary-dark)' }}>{r.itemName}</td>
                  <td>{r.quantity.toLocaleString()}</td>
                  <td>
                    <span className={`status-pill ${r.status}`}>
                      {r.status === 'pending' ? 'รออนุมัติ' : r.status === 'approved' ? 'อนุมัติแล้ว' : 'ปฏิเสธ'}
                    </span>
                  </td>
                  <td>
                    {r.status === "pending" ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn-action approve"
                          style={{ background: '#dcfce7', color: '#16a34a', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                          onClick={() => updateStatus(r._id, "approved")}
                        >
                          อนุมัติ
                        </button>
                        <button
                          className="btn-action reject"
                          style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                          onClick={() => updateStatus(r._id, "rejected")}
                        >
                          ปฏิเสธ
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600 italic' }}>ดำเนินการแล้ว</span>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                    ไม่มีรายการคำขอในขณะนี้
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
