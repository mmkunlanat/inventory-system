"use client";
import { useEffect, useState, useCallback } from "react";
import "../dashboard/dashboard-content.css";


export default function AdminCenters() {
  const [centers, setCenters] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [editCenter, setEditCenter] = useState(null);

  const fetchCenters = useCallback(async () => {
    const res = await fetch("/api/centers");
    const data = await res.json();
    setCenters(data);
  }, []);

  useEffect(() => {
    fetchCenters();
  }, [fetchCenters]);

  const addCenter = async () => {
    if (!name) return alert("กรุณาระบุชื่อศูนย์");
    await fetch("/api/centers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, location, contact }),
    });
    setName("");
    setLocation("");
    setContact("");
    fetchCenters();
  };

  const updateCenter = async () => {
    await fetch("/api/centers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editCenter),
    });
    setEditCenter(null);
    fetchCenters();
  };

  const deleteCenter = async (id) => {
    if (!confirm("ลบศูนย์อพยพนี้หรือไม่?")) return;
    await fetch("/api/centers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchCenters();
  };

  return (
    <div className="dashboard-content">
      <header className="page-header">
        <div className="header-left">
          <h1 className="page-title">🏥 จัดการศูนย์ปฏิบัติการ</h1>
          <p className="page-description">เพิ่มและจัดการข้อมูลศูนย์อพยพ/หน่วยงานรับบริจาคในเครือข่าย</p>
        </div>
      </header>

      {/* เพิ่มศูนย์แบบ Premium Form */}
      <div className="form-card">
        <h3 style={{ marginBottom: '24px', fontSize: '18px', fontWeight: '700' }}>➕ เพิ่มศูนย์ปฏิบัติการใหม่</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <input
            className="premium-input"
            placeholder="ชื่อศูนย์ (เช่น ศูนย์ดอนเมือง)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="premium-input"
            placeholder="ที่ตั้ง/พิกัด"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            className="premium-input"
            placeholder="เบอร์ติดต่อ"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
        <button className="btn-primary-premium" onClick={addCenter} style={{ width: '100%' }}>
          ยืนยันการเพิ่มศูนย์
        </button>
      </div>

      {/* ตารางศูนย์แบบ Premium */}
      <div className="table-card">
        <div className="card-header">
          <h3>รายชื่อศูนย์ปฏิบัติการทั้งหมด</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>🏥 ชื่อศูนย์</th>
                <th>📍 ที่ตั้ง</th>
                <th>📞 ติดต่อ</th>
                <th>⚙️ จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {centers.map((center) => (
                <tr key={center._id}>
                  <td style={{ fontWeight: '700' }}>{center.name}</td>
                  <td>{center.location}</td>
                  <td>{center.contact}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn-action edit"
                        style={{ background: '#fef3c7', color: '#d97706', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={() => setEditCenter(center)}
                      >
                        แก้ไข
                      </button>
                      <button
                        className="btn-action delete"
                        style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={() => deleteCenter(center._id)}
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {centers.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                    ยังไม่มีศูนย์อพยพในระบบ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Edit Center Modal */}
      {editCenter && (
        <div className="premium-modal-overlay">
          <div className="premium-modal">
            <h2 style={{ marginBottom: '24px' }}>📝 แก้ไขข้อมูลศูนย์</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                className="premium-input"
                placeholder="ชื่อศูนย์"
                value={editCenter.name}
                onChange={e => setEditCenter({ ...editCenter, name: e.target.value })}
              />
              <input
                className="premium-input"
                placeholder="ที่ตั้ง"
                value={editCenter.location}
                onChange={e => setEditCenter({ ...editCenter, location: e.target.value })}
              />
              <input
                className="premium-input"
                placeholder="ติดต่อ"
                value={editCenter.contact}
                onChange={e => setEditCenter({ ...editCenter, contact: e.target.value })}
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button className="btn-primary-premium" style={{ flex: 1 }} onClick={updateCenter}>
                  บันทึก
                </button>
                <button
                  className="btn-secondary-premium"
                  style={{ flex: 1, background: '#f1f5f9', border: 'none', borderRadius: '14px', fontWeight: '700', cursor: 'pointer' }}
                  onClick={() => setEditCenter(null)}
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
