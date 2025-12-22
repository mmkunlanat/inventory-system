"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../dashboard/dashboard-content.css";


export default function Page() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const res = await fetch("/api/items");
    const data = await res.json();
    setItems(data);
  };

  // ลบสินค้า
  const deleteItem = async (id) => {
    if (!confirm("ต้องการลบสินค้านี้หรือไม่")) return;

    await fetch("/api/items", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    loadItems();
  };

  // บันทึกแก้ไข
  const saveEdit = async () => {
    await fetch("/api/items", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editItem)
    });

    setEditItem(null);
    loadItems();
  };


  return (
    <div className="dashboard-content">
      <header className="page-header">
        <div className="header-left">
          <h1 className="page-title">📦 จัดการคลังสินค้า</h1>
          <p className="page-description">เพิ่ม แก้ไข และติดตามจำนวนสินค้าบริจาคในระบบ</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary-premium">➕ เพิ่มสินค้าใหม่</button>
        </div>
      </header>

      <div className="table-card">
        <div className="card-header">
          <h3>รายการสินค้าทั้งหมด</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>📦 ชื่อสินค้า</th>
                <th>🏷️ ประเภท</th>
                <th>📊 จำนวนคงเหลือ</th>
                <th>📏 หน่วย</th>
                <th>⚙️ จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id}>
                  <td style={{ fontWeight: '700' }}>{item.name}</td>
                  <td>
                    <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '8px', fontSize: '13px' }}>
                      {item.category}
                    </span>
                  </td>
                  <td style={{ color: item.quantity < 10 ? 'var(--danger)' : 'inherit' }}>
                    {item.quantity.toLocaleString()}
                  </td>
                  <td>{item.unit}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn-action edit"
                        style={{ background: '#fef3c7', color: '#d97706', border: 'none', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={() => setEditItem(item)}
                      >
                        แก้ไข
                      </button>

                      <button
                        className="btn-action delete"
                        style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={() => deleteItem(item._id)}
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>ไม่มีสินค้าในคลัง</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium Edit Modal */}
      {editItem && (
        <div className="premium-modal-overlay">
          <div className="premium-modal">
            <h2 style={{ marginBottom: '24px', letterSpacing: '-0.02em' }}>📝 แก้ไขข้อมูลสินค้า</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '8px', display: 'block' }}>ชื่อสินค้า</label>
                <input
                  className="premium-input"
                  value={editItem.name}
                  onChange={e => setEditItem({ ...editItem, name: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '8px', display: 'block' }}>จำนวนคงเหลือ</label>
                <input
                  type="number"
                  className="premium-input"
                  value={editItem.quantity}
                  onChange={e => setEditItem({ ...editItem, quantity: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button className="btn-primary-premium" style={{ flex: 1 }} onClick={saveEdit}>
                  บันทึกการแก้ไข
                </button>
                <button
                  className="btn-secondary-premium"
                  style={{ flex: 1, background: '#f1f5f9', border: 'none', borderRadius: '14px', fontWeight: '700', cursor: 'pointer' }}
                  onClick={() => setEditItem(null)}
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
