"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return null;

  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <h2 className="mb-4 fw-bold">Dashboard ผู้ดูแลระบบ</h2>

        <div className="row g-4">

          <DashboardCard
            title="สินค้าบริจาค"
            value={data.itemsCount}
            color="primary"
            link="/admin/items"
          />

          <DashboardCard
            title="ศูนย์อพยพ"
            value={data.centersCount}
            color="success"
            link="/admin/centers"
          />

          <DashboardCard
            title="คำขอทั้งหมด"
            value={data.requestsCount}
            color="warning"
            link="/admin/requests"
          />

          <DashboardCard
            title="รออนุมัติ"
            value={data.pendingCount}
            color="danger"
            link="/admin/requests"
          />

        </div>

        {/* คำขอล่าสุด */}
        <div className="card mt-5 shadow-sm">
          <div className="card-header fw-bold">
            คำขอรับบริจาคล่าสุด
          </div>
          <div className="card-body p-0">
            <table className="table mb-0">
              <thead className="table-light">
                <tr>
                  <th>ศูนย์</th>
                  <th>สินค้า</th>
                  <th>จำนวน</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {data.latestRequests.map((r) => (
                  <tr key={r._id}>
                    <td>{r.centerName}</td>
                    <td>{r.itemName}</td>
                    <td>{r.quantity}</td>
                    <td>
                      <span
                        className={`badge ${
                          r.status === "approved"
                            ? "bg-success"
                            : r.status === "rejected"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {data.latestRequests.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center">
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}

/* การ์ดเล็ก ๆ */
function DashboardCard({ title, value, color, link }) {
  return (
    <div className="col-md-3">
      <div className={`card text-bg-${color} shadow-sm h-100`}>
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="fs-3">{value}</p>
          <a href={link} className="btn btn-light btn-sm">
            ดูรายละเอียด
          </a>
        </div>
      </div>
    </div>
  );
}
