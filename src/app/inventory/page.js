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

    useEffect(() => {
        fetchItems();
    }, [search, filterCategory]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchItems();
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
                    <p>ติดตามสถานะสินค้าคงคลังแบบ Real-time</p>
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
                                <div key={item._id} className="item-card">
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
            </main>

            <footer className="inventory-footer">
                <p>© 2025 RescueSync Platform. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
