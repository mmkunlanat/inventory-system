"use client"
import { useState } from "react";

export default function Page() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");

  const saveItem = async () => {
    await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        category: "อาหาร",
        quantity,
        unit: "กล่อง"
      })
    });
    alert("บันทึกสำเร็จ");
  };

  return (
    <div className="container mt-5">
      <h3>เพิ่มสินค้าบริจาค</h3>

      <input className="form-control mb-2"
        placeholder="ชื่อสินค้า"
        onChange={e => setName(e.target.value)}
      />

      <input className="form-control mb-2"
        placeholder="จำนวน"
        type="number"
        onChange={e => setQuantity(e.target.value)}
      />

      <button className="btn btn-primary" onClick={saveItem}>
        บันทึก
      </button>
    </div>
  );
}
