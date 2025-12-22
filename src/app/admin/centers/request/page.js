"use client"
import { useEffect, useState } from "react";

export default function RequestPage() {
  const [items, setItems] = useState([]);
  const [centerId, setCenterId] = useState("");

  useEffect(() => {
    fetch("/api/items").then(res => res.json()).then(setItems);
    fetch("/api/centers").then(res => res.json())
      .then(data => setCenterId(data[0]?._id));
  }, []);

  const submit = async () => {
    const requestItems = items
      .filter(i => i.requestQty > 0)
      .map(i => ({
        itemId: i._id,
        quantity: i.requestQty
      }));

    await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        centerId,
        items: requestItems
      })
    });

    alert("ส่งคำขอแล้ว");
  };

  return (
    <div className="container mt-5">
      <h3>ขอรับสินค้าบริจาค</h3>

      {items.map(item => (
        <div className="mb-2" key={item._id}>
          {item.name} (คงเหลือ {item.quantity})
          <input
            type="number"
            className="form-control"
            min="0"
            onChange={e => item.requestQty = Number(e.target.value)}
          />
        </div>
      ))}

      <button className="btn btn-success mt-3" onClick={submit}>
        ส่งคำขอ
      </button>
    </div>
  );
}
