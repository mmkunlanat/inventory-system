"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function CenterRequest() {
  const [centerName, setCenterName] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");

  const submitRequest = async () => {
    await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        centerName,
        itemName,
        quantity,
      }),
    });
    alert("ส่งคำขอเรียบร้อย");
    setItemName("");
    setQuantity("");
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h3>ขอรับสินค้าบริจาค</h3>

        <input
          className="form-control mb-2"
          placeholder="ชื่อศูนย์อพยพ"
          value={centerName}
          onChange={(e) => setCenterName(e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="ชื่อสินค้า"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />

        <input
          className="form-control mb-2"
          type="number"
          placeholder="จำนวน"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button className="btn btn-success" onClick={submitRequest}>
          ส่งคำขอ
        </button>
      </div>
    </>
  );
}
