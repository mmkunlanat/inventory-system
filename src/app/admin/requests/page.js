"use client"
import { useEffect, useState } from "react";

export default function Page() {
  const [requests, setRequests] = useState([]);

  const load = async () => {
    const res = await fetch("/api/requests");
    setRequests(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    const res = await fetch(`/api/requests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (!res.ok) {
      alert("สินค้าไม่พอ");
    }
    load();
  };

  return (
    <div>
      <h3>คำขอรับบริจาค</h3>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ศูนย์</th>
            <th>สินค้า</th>
            <th>จำนวน</th>
            <th>สถานะ</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r._id}>
              <td>{r.centerName}</td>
              <td>{r.itemId?.name}</td>
              <td>{r.quantity}</td>
              <td>{r.status}</td>
              <td>
                {r.status === "pending" && (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => updateStatus(r._id, "approved")}
                    >
                      อนุมัติ
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => updateStatus(r._id, "rejected")}
                    >
                      ปฏิเสธ
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
