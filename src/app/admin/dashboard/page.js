"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [items, setItems] = useState([]);

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

  // คำนวณข้อมูล
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalItems = items.length;

  const categorySummary = {};
  items.forEach(i => {
    categorySummary[i.category] =
      (categorySummary[i.category] || 0) + i.quantity;
  });

  return (
    <div>
      <h3>Dashboard สรุปข้อมูล</h3>

      {/* สรุปบนการ์ด */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-bg-primary">
            <div className="card-body">
              <h5>จำนวนสินค้าทั้งหมด</h5>
              <h2>{totalQuantity}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-bg-success">
            <div className="card-body">
              <h5>จำนวนรายการสินค้า</h5>
              <h2>{totalItems}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* ตารางสรุปตามประเภท */}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ประเภทสินค้า</th>
            <th>จำนวนคงเหลือ</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(categorySummary).map(cat => (
            <tr key={cat}>
              <td>{cat}</td>
              <td>{categorySummary[cat]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
