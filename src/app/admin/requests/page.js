"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const res = await fetch("/api/requests");
    const data = await res.json();
    setRequests(data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    await fetch("/api/requests", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchRequests();
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h3>คำขอรับบริจาค</h3>

        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>ศูนย์</th>
              <th>สินค้า</th>
              <th>จำนวน</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r._id}>
                <td>{r.centerName}</td>
                <td>{r.itemName}</td>
                <td>{r.quantity}</td>
                <td>
                  <span className={
                    r.status === "approved"
                      ? "badge bg-success"
                      : r.status === "rejected"
                      ? "badge bg-danger"
                      : "badge bg-warning text-dark"
                  }>
                    {r.status}
                  </span>
                </td>
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
            {requests.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">
                  ไม่มีคำขอ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
