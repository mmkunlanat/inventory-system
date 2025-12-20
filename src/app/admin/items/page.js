"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    if (sessionStorage.getItem("role") !== "admin") {
      router.push("/login");
    } else {
      loadItems();
    }
  }, []);

  const loadItems = async () => {
    const res = await fetch("/api/items");
    const data = await res.json();
    setItems(data);
  };

  // ลบสินค้า
  const deleteItem = async (id) => {
    if (!confirm("ต้องการลบสินค้านี้หรือไม่")) return;

    await fetch(`/api/items/${id}`, { method: "DELETE" });
    loadItems();
  };

  // บันทึกแก้ไข
  const saveEdit = async () => {
    await fetch(`/api/items/${editItem._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editItem)
    });

    setEditItem(null);
    loadItems();
  };

  return (
    <div>
      <h3>จัดการสินค้าบริจาค</h3>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ชื่อ</th>
            <th>ประเภท</th>
            <th>จำนวน</th>
            <th>หน่วย</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
              <td>{item.unit}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => setEditItem(item)}
                >
                  แก้ไข
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteItem(item._id)}
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal แก้ไข */}
      {editItem && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5>แก้ไขสินค้า</h5>

              <input
                className="form-control mb-2"
                value={editItem.name}
                onChange={e =>
                  setEditItem({ ...editItem, name: e.target.value })
                }
              />

              <input
                type="number"
                className="form-control mb-2"
                value={editItem.quantity}
                onChange={e =>
                  setEditItem({ ...editItem, quantity: e.target.value })
                }
              />

              <button className="btn btn-success me-2" onClick={saveEdit}>
                บันทึก
              </button>

              <button className="btn btn-secondary" onClick={() => setEditItem(null)}>
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
