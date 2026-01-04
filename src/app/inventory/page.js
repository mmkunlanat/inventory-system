"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import "./inventory.css";

export default function InventoryPage() {
    const [items, setItems] = useState([]);
    const [stats, setStats] = useState({
        totalItems: 0,
        totalQuantity: 0,
        categories: [],
    });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("");

    // Request Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [centers, setCenters] = useState([]);
    const [centerSearch, setCenterSearch] = useState("");
    const [showCenters, setShowCenters] = useState(false);
    const [requestData, setRequestData] = useState({
        centerName: "",
        quantity: 1,
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const fetchHistory = async (name) => {
        if (!name) return;
        setHistoryLoading(true);
        try {
            const res = await fetch("/api/requests");
            const data = await res.json();
            const myHistory = data.filter(r => r.centerName === name);
            setHistory(myHistory);
        } catch (err) {
            console.error("Error fetching history:", err);
        } finally {
            setHistoryLoading(false);
        }
    };

    // Fetch data
    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/items");
            const data = await res.json();

            if (Array.isArray(data)) {
                // Filter by search and category
                let filtered = data;

                if (search) {
                    filtered = filtered.filter(
                        (item) =>
                            item.name?.toLowerCase().includes(search.toLowerCase()) ||
                            item.category?.toLowerCase().includes(search.toLowerCase())
                    );
                }

                if (filterCategory) {
                    filtered = filtered.filter((item) => item.category === filterCategory);
                }

                setItems(filtered);

                // Calculate stats from all data
                const categories = [...new Set(data.map((item) => item.category).filter(Boolean))];
                setStats({
                    totalItems: data.length,
                    totalQuantity: data.reduce((sum, item) => sum + (item.quantity || 0), 0),
                    categories,
                });
            }
        } catch (error) {
            console.error("Error fetching items:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCenters = async () => {
        try {
            const res = await fetch("/api/operation-centers");
            const data = await res.json();
            if (data.success) {
                setCenters(data.data);
            }
        } catch (error) {
            console.error("Error fetching centers:", error);
        }
    };

    useEffect(() => {
        const savedCenter = localStorage.getItem("lastCenter");
        if (savedCenter) {
            setCenterSearch(savedCenter);
            setRequestData(prev => ({ ...prev, centerName: savedCenter }));
            fetchHistory(savedCenter);
        }
        fetchItems();
        fetchCenters();
    }, [search, filterCategory]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchItems();
    };

    const openRequestModal = (item) => {
        setSelectedItem(item);
        const savedCenter = localStorage.getItem("lastCenter") || "";
        setRequestData({
            centerName: savedCenter,
            quantity: 1,
        });
        setCenterSearch(savedCenter);
        setMessage(null);
        setShowModal(true);
    };

    const handleCenterSearch = (e) => {
        const val = e.target.value;
        setCenterSearch(val);
        setRequestData({ ...requestData, centerName: val });
        setShowCenters(val.trim() !== "");
    };

    const selectCenter = (name) => {
        setCenterSearch(name);
        setRequestData({ ...requestData, centerName: name });
        setShowCenters(false);
        localStorage.setItem("lastCenter", name);
        fetchHistory(name);
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            const res = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    centerName: requestData.centerName,
                    items: [{
                        itemName: selectedItem.name,
                        quantity: requestData.quantity,
                        unit: selectedItem.unit
                    }]
                }),
            });

            if (res.ok) {
                setMessage({ type: "success", text: "ส่งคำขอเรียบร้อยแล้ว แอดมินจะดำเนินการตรวจสอบคลังและยืนยันอีกครั้ง" });
                localStorage.setItem("lastCenter", requestData.centerName);
                fetchHistory(requestData.centerName);
                setTimeout(() => {
                    setShowModal(false);
                    setSelectedItem(null);
                }, 2000);
            } else {
                const data = await res.json();
                setMessage({ type: "error", text: data.error || "เกิดข้อผิดพลาด" });
            }
        } catch (err) {
            setMessage({ type: "error", text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้" });
        } finally {
            setSubmitting(false);
        }
    };

    const getCategoryIcon = (category) => {
        const iconMap = {
            "อาหาร": "🍚",
            "เครื่องดื่ม": "🥤",
            "ยา": "💊",
            "เสื้อผ้า": "👕",
            "ของใช้": "🧴",
            "อุปกรณ์": "🔧",
            "เครื่องนอน": "🛏️",
            "อื่นๆ": "📦",
        };
        return iconMap[category] || "📦";
    };

    const getQuantityStatus = (quantity) => {
        if (quantity <= 0) return { class: "qty-empty", label: "หมด" };
        if (quantity <= 10) return { class: "qty-low", label: "ใกล้หมด" };
        if (quantity <= 50) return { class: "qty-medium", label: "ปกติ" };
        return { class: "qty-high", label: "เพียงพอ" };
    };

    return (
        <div className="inventory-container">
            <Navbar />

            <main className="inventory-main">
                {/* Header */}
                <div className="inventory-header">
                    <Link href="/" className="back-link">
                        ← กลับหน้าหลัก
                    </Link>
                    <h1>คลังสินค้าบริจาค</h1>
                    <p>ติดตามสถานะและคลิกที่สินค้าเพื่อเลือก "ขอรับบริจาค" ไปยังศูนย์อพยพของคุณ</p>
                </div>

                {/* Statistics */}
                <div className="stats-grid">
                    <div className="stat-card stat-items">
                        <div className="stat-icon">📦</div>
                        <div className="stat-info">
                            <span className="stat-number">{stats.totalItems}</span>
                            <span className="stat-label">รายการสินค้า</span>
                        </div>
                    </div>
                    <div className="stat-card stat-quantity">
                        <div className="stat-icon">📊</div>
                        <div className="stat-info">
                            <span className="stat-number">{stats.totalQuantity.toLocaleString()}</span>
                            <span className="stat-label">จำนวนรวม</span>
                        </div>
                    </div>
                    <div className="stat-card stat-categories">
                        <div className="stat-icon">🏷️</div>
                        <div className="stat-info">
                            <span className="stat-number">{stats.categories.length}</span>
                            <span className="stat-label">หมวดหมู่</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="filters-section">
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อสินค้า, หมวดหมู่..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-btn">
                            🔍 ค้นหา
                        </button>
                    </form>

                    <div className="filter-group">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">หมวดหมู่ทั้งหมด</option>
                            {stats.categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {getCategoryIcon(cat)} {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results count */}
                <div className="results-info">
                    พบ <strong>{items.length}</strong> รายการ
                    {(search || filterCategory) && " (กรองแล้ว)"}
                </div>

                {/* Table / Cards */}
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>กำลังโหลดข้อมูล...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📦</span>
                        <p>ไม่พบสินค้าในคลัง</p>
                        <span className="empty-hint">
                            {search || filterCategory
                                ? "ลองเปลี่ยนคำค้นหาหรือตัวกรอง"
                                : "ยังไม่มีสินค้าบริจาคในระบบ"}
                        </span>
                    </div>
                ) : (
                    <div className="items-grid">
                        {items.map((item) => {
                            const qtyStatus = getQuantityStatus(item.quantity);
                            return (
                                <div key={item._id} className="item-card clickable" onClick={() => openRequestModal(item)}>
                                    <div className="item-header">
                                        <span className="item-icon">{getCategoryIcon(item.category)}</span>
                                        <span className={`item-badge ${qtyStatus.class}`}>{qtyStatus.label}</span>
                                    </div>
                                    <h3 className="item-name">{item.name}</h3>
                                    <div className="item-category">{item.category || "ไม่ระบุหมวดหมู่"}</div>
                                    <div className="item-quantity">
                                        <span className="qty-number">{item.quantity?.toLocaleString() || 0}</span>
                                        <span className="qty-unit">{item.unit || "ชิ้น"}</span>
                                    </div>
                                    <div className="item-action">
                                        <button className="request-btn">
                                            🎁 ขอรับสินค้านี้
                                        </button>
                                    </div>
                                    <div className="item-updated">
                                        อัพเดท:{" "}
                                        {item.updatedAt
                                            ? new Date(item.updatedAt).toLocaleDateString("th-TH")
                                            : "-"}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* History Section */}
                {requestData.centerName && (
                    <div className="history-section" style={{ marginTop: "60px", padding: "32px", background: "rgba(255,255,255,0.03)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ marginBottom: "24px" }}>
                            <h2 style={{ fontSize: "24px", color: "white", marginBottom: "8px" }}>📦 ประวัติการขอรับของ ({requestData.centerName})</h2>
                            <p style={{ color: "#94a3b8" }}>ติดตามสถานะรายการที่คุณเคยขอไว้จากหน้านี้</p>
                        </div>

                        {historyLoading ? (
                            <p style={{ textAlign: "center", padding: "20px" }}>กำลังโหลดประวัติ...</p>
                        ) : history.length > 0 ? (
                            <div className="history-table-container" style={{ overflowX: "auto" }}>
                                <table className="history-table" style={{ width: "100%", borderCollapse: "collapse", color: "white" }}>
                                    <thead style={{ background: "rgba(255,255,255,0.05)" }}>
                                        <tr>
                                            <th style={{ padding: "16px", textAlign: "left" }}>วันที่</th>
                                            <th style={{ padding: "16px", textAlign: "left" }}>รายการสินค้า</th>
                                            <th style={{ padding: "16px", textAlign: "left" }}>สถานะ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((h) => (
                                            <tr key={h._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                                <td style={{ padding: "16px", fontSize: "13px" }}>{new Date(h.createdAt).toLocaleDateString("th-TH")}</td>
                                                <td style={{ padding: "16px" }}>
                                                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                                        {(h.items || [{ itemName: h.itemName, quantity: h.quantity, unit: h.unit }]).map((it, idx) => (
                                                            <div key={idx} style={{ fontSize: "14px" }}>
                                                                • {it.itemName} ({it.quantity} {it.unit})
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td style={{ padding: "16px" }}>
                                                    <span className={`status-pill ${h.status}`}>
                                                        {h.status === 'pending' ? 'รออนุมัติ' : h.status === 'approved' ? 'อนุมัติแล้ว' : 'ปฏิเสธ'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>ยังไม่มีประวัติการส่งคำขอ</p>
                        )}
                    </div>
                )}
            </main>

            {/* Request Modal */}
            {showModal && selectedItem && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="request-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setShowModal(false)}>×</button>

                        <div className="modal-header">
                            <span className="modal-icon">{getCategoryIcon(selectedItem.category)}</span>
                            <div>
                                <h2>ขอรับสินค้าบริจาค</h2>
                                <p>รายการ: <strong>{selectedItem.name}</strong></p>
                            </div>
                        </div>

                        {message && (
                            <div className={`modal-alert ${message.type}`}>
                                {message.type === 'success' ? '✅' : '❌'} {message.text}
                            </div>
                        )}

                        <form onSubmit={handleRequestSubmit} className="modal-form">
                            <div className="modal-form-group relative">
                                <label>ศูนย์อพยพ / หน่วยงาน</label>
                                <input
                                    type="text"
                                    placeholder="พิมพ์ค้นหาชื่อศูนย์ของคุณ"
                                    value={centerSearch}
                                    onChange={handleCenterSearch}
                                    required
                                    autoComplete="off"
                                />
                                {showCenters && centers.filter(c => c.name.toLowerCase().includes(centerSearch.toLowerCase())).length > 0 && (
                                    <ul className="modal-suggestions">
                                        {centers
                                            .filter(c => c.name.toLowerCase().includes(centerSearch.toLowerCase()))
                                            .slice(0, 5)
                                            .map((center, idx) => (
                                                <li key={idx} onClick={() => selectCenter(center.name)}>
                                                    <strong>{center.name}</strong>
                                                    <small>อ.{center.district} ต.{center.subdistrict}</small>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                )}
                            </div>

                            <div className="modal-form-group">
                                <label>จำนวนที่ต้องการ ({selectedItem.unit})</label>
                                <div className="q-input-row">
                                    <input
                                        type="number"
                                        min="1"
                                        max={selectedItem.quantity}
                                        value={requestData.quantity}
                                        onChange={(e) => setRequestData({ ...requestData, quantity: e.target.value })}
                                        required
                                    />
                                    <span className="unit-label">{selectedItem.unit}</span>
                                </div>
                                <span className="stock-info">คงเหลือในคลัง: {selectedItem.quantity} {selectedItem.unit}</span>
                            </div>

                            <button type="submit" className="modal-submit-btn" disabled={submitting}>
                                {submitting ? "กำลังส่งคำขอ..." : "ยืนยันการส่งคำขอ"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <footer className="inventory-footer">
                <p>© 2025 RescueSync Platform. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
