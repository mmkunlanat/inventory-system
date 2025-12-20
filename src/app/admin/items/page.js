"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState([]);

  // 🔐 เช็คสิทธิ์ Admin
  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (role !== "admin") {
      router.push("/login");
    } else {
      loadItems();
    }
  }, []);

  // โหลดรายการสินค้า
  const loadItems = async () => {
    const res = await fetch("/api/items");
    const data = await res.json();
    setItems(data);
  };

  // บันทึกสินค้า
  const saveItem = async () => {
    if (!name || !quantity) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        category: "อาหาร",
        quantity: Number(quantity),
        unit: "กล่อง"
      })
    });

    setName("");
    setQuantity("");
    loadItems();
  };

  return (
    <div>
      <h3>จัดการสินค้าบริจาค</h3>

      {/* ฟอร์มเพิ่มสินค้า */}
      <div className="card p-3 mb-4">
        <input
          className="form-control mb-2"
          placeholder="ชื่อสินค้า"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="จำนวน"
          type="number"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
        />

        <button className="btn btn-primary" onClick={saveItem}>
          บันทึก
        </button>
      </div>

      {/* ตารางแสดงสินค้า */}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ชื่อสินค้า</th>
            <th>ประเภท</th>
            <th>คงเหลือ</th>
            <th>หน่วย</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
              <td>{item.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
