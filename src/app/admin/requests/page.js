"use client";
import { useEffect, useState } from "react";
import "../dashboard/dashboard-content.css";

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [statusLoading, setStatusLoading] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchRequests = async () => {
    const res = await fetch("/api/requests");
    const data = await res.json();
    setRequests(data);
  };

  const fetchInventory = async () => {
    const res = await fetch("/api/items");
    const data = await res.json();
    setInventory(data);
  };

  useEffect(() => {
    fetchRequests();
    fetchInventory();
  }, []);

  const updateStatus = async (id, status) => {
    setStatusLoading(id);
    try {
      const res = await fetch("/api/requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("❌ " + (data.error || "เกิดข้อผิดพลาดในการอัปเดตสถานะ"));
      } else {
        await fetchRequests();
        await fetchInventory(); // Refresh stock after status change
      }
    } catch (err) {
      alert("❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setStatusLoading(null);
    }
  };

  const deleteRequest = async (id) => {
    if (!confirm("คุณต้องการลบรายการคำขอนี้หรือไม่?")) return;

    setDeleteLoading(id);
    try {
      const res = await fetch("/api/requests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        await fetchRequests();
      } else {
        alert("❌ ลบไม่สำเร็จ");
      }
    } catch (err) {
      alert("❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setDeleteLoading(null);
    }
  };

  const getStockInfo = (itemName) => {
    const item = inventory.find(i => i.name.toLowerCase().trim() === itemName.toLowerCase().trim());
    return item ? { quantity: item.quantity, unit: item.unit } : { quantity: 0, unit: "-" };
  };

  return (
    <div className="dashboard-content">
      <header className="page-header">
        <div className="header-left">
          <h1 className="page-title">📑 คำขอรับบริจาค</h1>
          <p className="page-description">ตรวจสอบและกดยืนยันการส่งสินค้าไปยังศูนย์อพยพ (เชื่อมโยงกับคลังสินค้า)</p>
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
                <th colSpan="3">🎁 รายการสินค้าที่ขอ (จำนวน/คลังคงเหลือ)</th>
                <th>📋 สถานะ</th>
                <th>⚙️ จัดการคำขอ</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id}>
                  <td style={{ fontWeight: '700', verticalAlign: 'top', paddingTop: '16px' }}>{r.centerName}</td>
                  <td colSpan="3">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {r.items.map((item, idx) => {
                        const stock = getStockInfo(item.itemName);
                        const isOutOfStock = stock.quantity < item.quantity;
                        return (
                          <div key={idx} style={{
                            padding: '10px 14px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div>
                              <div style={{ fontWeight: '700', color: 'var(--primary-dark)', fontSize: '14px' }}>
                                {item.itemName}
                              </div>
                              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                                ขอ: <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{item.quantity.toLocaleString()} {item.unit}</span>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '11px', color: '#94a3b8' }}>ในคลัง</div>
                              <div style={{ fontWeight: '700', color: isOutOfStock ? '#ef4444' : '#10b981' }}>
                                {stock.quantity.toLocaleString()} {stock.unit}
                              </div>
                              {isOutOfStock && r.status === 'pending' && (
                                <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: '600' }}>ไม่พอ</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td style={{ verticalAlign: 'top', paddingTop: '16px' }}>
                    <span className={`status-pill ${r.status}`}>
                      {r.status === 'pending' ? 'รออนุมัติ' : r.status === 'approved' ? 'อนุมัติแล้ว' : 'ปฏิเสธ'}
                    </span>
                  </td>
                  <td style={{ verticalAlign: 'top', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        className="btn-action approve"
                        style={{
                          background: r.status === 'approved' ? '#22c55e' : '#dcfce7',
                          color: r.status === 'approved' ? '#ffffff' : '#16a34a',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          cursor: statusLoading === r._id ? 'not-allowed' : 'pointer',
                          fontWeight: 'bold',
                          fontSize: '13px',
                          opacity: statusLoading === r._id ? 0.5 : 1
                        }}
                        onClick={() => updateStatus(r._id, "approved")}
                        disabled={statusLoading === r._id}
                      >
                        {statusLoading === r._id && r.status !== 'approved' ? "..." : "อนุมัติ"}
                      </button>

                      <button
                        className="btn-action reject"
                        style={{
                          background: r.status === 'rejected' ? '#ef4444' : '#fee2e2',
                          color: r.status === 'rejected' ? '#ffffff' : '#dc2626',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          cursor: statusLoading === r._id ? 'not-allowed' : 'pointer',
                          fontWeight: 'bold',
                          fontSize: '13px',
                          opacity: statusLoading === r._id ? 0.5 : 1
                        }}
                        onClick={() => updateStatus(r._id, "rejected")}
                        disabled={statusLoading === r._id}
                      >
                        {statusLoading === r._id && r.status !== 'rejected' ? "..." : "ปฏิเสธ"}
                      </button>

                      <button
                        className="btn-action delete"
                        style={{
                          background: '#fff1f2',
                          color: '#e11d48',
                          border: '1px solid #fda4af',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          cursor: deleteLoading === r._id ? 'not-allowed' : 'pointer',
                          fontWeight: 'bold',
                          fontSize: '13px',
                          opacity: deleteLoading === r._id ? 0.5 : 1
                        }}
                        onClick={() => deleteRequest(r._id)}
                        disabled={deleteLoading === r._id}
                      >
                        {deleteLoading === r._id ? "..." : "🗑️ ลบ"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
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
