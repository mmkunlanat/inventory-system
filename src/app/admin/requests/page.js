"use client"
import { useEffect, useState } from "react";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch("/api/requests")
      .then(res => res.json())
      .then(setRequests);
  }, []);

  const updateStatus = async (id, approve) => {
    await fetch("/api/requests", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId: id, approve })
    });
    location.reload();
  };

  return (
    <div className="container mt-5">
      <h3>คำขอรับบริจาค</h3>

      {requests.map(r => (
        <div className="card mb-3" key={r._id}>
          <div className="card-body">
            <h5>{r.centerId?.name}</h5>
            <ul>
              {r.items.map(i => (
                <li key={i._id}>
                  {i.itemId?.name} - {i.quantity}
                </li>
              ))}
            </ul>

            <button className="btn btn-success me-2"
              onClick={() => updateStatus(r._id, true)}>
              อนุมัติ
            </button>
            <button className="btn btn-danger"
              onClick={() => updateStatus(r._id, false)}>
              ปฏิเสธ
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
