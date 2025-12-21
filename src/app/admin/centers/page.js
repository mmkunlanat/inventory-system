"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function AdminCenters() {
  const [centers, setCenters] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");

  const fetchCenters = async () => {
    const res = await fetch("/api/centers");
    const data = await res.json();
    setCenters(data);
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const addCenter = async () => {
    await fetch("/api/centers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, location, contact }),
    });
    setName("");
    setLocation("");
    setContact("");
    fetchCenters();
  };

  const deleteCenter = async (id) => {
    if (!confirm("ลบศูนย์อพยพนี้หรือไม่?")) return;
    await fetch("/api/centers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchCenters();
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <h3 className="mb-4">จัดการศูนย์อพยพ</h3>

        {/* เพิ่มศูนย์ */}
        <div className="card p-3 mb-4">
          <input
            className="form-control mb-2"
            placeholder="ชื่อศูนย์"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="form-control mb-2"
            placeholder="ที่ตั้ง"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            className="form-control mb-2"
            placeholder="ติดต่อ"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          <button className="btn btn-primary" onClick={addCenter}>
            เพิ่มศูนย์อพยพ
          </button>
        </div>

        {/* ตารางศูนย์ */}
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>ชื่อศูนย์</th>
              <th>ที่ตั้ง</th>
              <th>ติดต่อ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {centers.map((center) => (
              <tr key={center._id}>
                <td>{center.name}</td>
                <td>{center.location}</td>
                <td>{center.contact}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteCenter(center._id)}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
            {centers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">
                  ยังไม่มีศูนย์อพยพ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
