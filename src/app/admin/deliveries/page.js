"use client";
import { useEffect, useState, useCallback } from "react";
import "../dashboard/dashboard-content.css";

export default function AdminDeliveries() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDeliveries = useCallback(async () => {
        try {
            const res = await fetch("/api/requests");
            const data = await res.json();
            // Filter only approved requests which are considered "deliveries"
            const approved = data.filter(r => r.status === "approved");
            setDeliveries(approved);
        } catch (err) {
            console.error("Failed to fetch deliveries", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDeliveries();
    }, [fetchDeliveries]);

    return (
        <div className="dashboard-content">
            <header className="page-header">
                <div className="header-left">
                    <h1 className="page-title">🚚 รายการจ่ายสินค้า</h1>
                    <p className="page-description">ประวัติการจ่ายสินค้าที่ได้รับการอนุมัติแล้วไปยังศูนย์อพยพต่างๆ</p>
                </div>
            </header>

            <div className="table-card">
                <div className="card-header">
                    <h3>ประวัติการส่งมอบสำเร็จ</h3>
                </div>
                <div className="table-wrapper">
                    {loading ? (
                        <div style={{ padding: "40px", textAlign: "center" }}>กำลังโหลดข้อมูล...</div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>📅 วันที่จ่าย</th>
                                    <th>🏥 ศูนย์อพยพ</th>
                                    <th>📦 รายการสินค้า</th>
                                    <th>🔢 จำนวนทั้งหมด</th>
                                    <th>📋 สถานะ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliveries.map((d) => (
                                    <tr key={d._id}>
                                        <td>{new Date(d.updatedAt).toLocaleDateString("th-TH")} {new Date(d.updatedAt).toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' })} น.</td>
                                        <td style={{ fontWeight: "700" }}>{d.centerName}</td>
                                        <td>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                                {(d.items?.length > 0 ? d.items : [{ itemName: d.itemName, quantity: d.quantity, unit: d.unit }]).map((item, idx) => (
                                                    <div key={idx} style={{ fontSize: "13px" }}>
                                                        • {item.itemName || "ไม่ระบุ"} ({item.quantity || 0} {item.unit})
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: "bold", color: "#10b981" }}>
                                                {(d.items?.reduce((sum, i) => sum + (i.quantity || 0), 0) || d.quantity || 0).toLocaleString()} หน่วย
                                            </span>
                                        </td>
                                        <td>
                                            <span className="status-pill approved">จ่ายสินค้าแล้ว</span>
                                        </td>
                                    </tr>
                                ))}
                                {deliveries.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
                                            ยังไม่มีรายการจ่ายสินค้าในระบบ
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
