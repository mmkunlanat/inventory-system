"use client"
import { useEffect, useState } from "react";

export default function Page() {
  const [items, setItems] = useState([]);
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    fetch("/api/items")
      .then(res => res.json())
      .then(setItems);
  }, []);

  const submit = async () => {
    await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        centerName: "ศูนย์อพยพ A",
        itemId,
        quantity
      })
    });
    alert("ส่งคำขอแล้ว");
  };

  return (
    <div className="container">
      <h3>ขอรับบริจาค</h3>

      <select
        className="form-control mb-2"
        onChange={e => setItemId(e.target.value)}
      >
        <option>-- เลือกสินค้า --</option>
        {items.map(i => (
          <option key={i._id} value={i._id}>
            {i.name} (คงเหลือ {i.quantity})
          </option>
        ))}
      </select>

      <input
        type="number"
        className="form-control mb-2"
        placeholder="จำนวน"
        onChange={e => setQuantity(e.target.value)}
      />

      <button className="btn btn-primary" onClick={submit}>
        ส่งคำขอ
      </button>
    </div>
  );
}
