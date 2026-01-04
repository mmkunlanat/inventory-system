"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import "./shelter-centers.css";

export default function ShelterCentersPage() {
    const [centers, setCenters] = useState([]);
    const [stats, setStats] = useState({});
    const [districts, setDistricts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterCapacity, setFilterCapacity] = useState("");
    const [filterDistrict, setFilterDistrict] = useState("");

    // Fetch data
    const fetchCenters = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (filterCapacity) params.append("capacityStatus", filterCapacity);
            if (filterDistrict) params.append("district", filterDistrict);

            const res = await fetch(`/api/operation-centers?${params.toString()}`);
            const data = await res.json();

            if (data.success) {
                setCenters(data.data);
                setStats(data.stats);
                setDistricts(data.districts);
            }
        } catch (error) {
            console.error("Error fetching centers:", error);
        } finally {
            setLoading(false);
        }
    }, [search, filterCapacity, filterDistrict]);

    useEffect(() => {
        fetchCenters();
    }, [fetchCenters]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCenters();
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            "รองรับได้": { class: "status-available", icon: "✅" },
            "ใกล้เต็ม": { class: "status-almost", icon: "⚠️" },
            "เต็ม": { class: "status-full", icon: "🔴" },
            "ล้นศูนย์": { class: "status-overflow", icon: "🚨" },
        };
        const info = statusMap[status] || { class: "status-unknown", icon: "❓" };
        return (
            <span className={`status-badge ${info.class}`}>
                {info.icon} {status || "ไม่ระบุ"}
            </span>
        );
    };

    const getShelterTypeIcon = (type) => {
        const iconMap = {
            "ศูนย์พักพิงหลัก": "🏥",
            "บ้านญาติ": "🏠",
            "วัด": "🛕",
            "โรงเรียน": "🏫",
            "อื่นๆ": "📍",
        };
        return iconMap[type] || "📍";
    };

    return (
        <div className="shelter-container">
            <Navbar />

            <main className="shelter-main">
                {/* Header */}
                <div className="shelter-header">
                    <Link href="/" className="back-link">
                        ← กลับหน้าหลัก
                    </Link>
                    <h1>ศูนย์อพยพ / พักพิง</h1>
                    <p>ตรวจสอบสถานะศูนย์อพยพทั่วประเทศ</p>
                </div>

                {/* Statistics */}
                <div className="stats-grid">
                    <div className="stat-card stat-total">
                        <div className="stat-icon">🏥</div>
                        <div className="stat-info">
                            <span className="stat-number">{stats.total || 0}</span>
                            <span className="stat-label">ศูนย์ทั้งหมด</span>
                        </div>
                    </div>
                    <div className="stat-card stat-available">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <span className="stat-number">{stats.available || 0}</span>
                            <span className="stat-label">รองรับได้</span>
                        </div>
                    </div>
                    <div className="stat-card stat-almost">
                        <div className="stat-icon">⚠️</div>
                        <div className="stat-info">
                            <span className="stat-number">{stats.almostFull || 0}</span>
                            <span className="stat-label">ใกล้เต็ม</span>
                        </div>
                    </div>
                    <div className="stat-card stat-full">
                        <div className="stat-icon">🔴</div>
                        <div className="stat-info">
                            <span className="stat-number">{stats.full || 0}</span>
                            <span className="stat-label">เต็ม</span>
                        </div>
                    </div>
                    <div className="stat-card stat-capacity">
                        <div className="stat-icon">👥</div>
                        <div className="stat-info">
                            <span className="stat-number">{stats.totalCapacity?.toLocaleString() || 0}</span>
                            <span className="stat-label">ความจุรวม (คน)</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="filters-section">
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อศูนย์, ที่ตั้ง, อำเภอ..."
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
                            value={filterCapacity}
                            onChange={(e) => setFilterCapacity(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">สถานะทั้งหมด</option>
                            <option value="รองรับได้">รองรับได้</option>
                            <option value="ใกล้เต็ม">ใกล้เต็ม</option>
                            <option value="เต็ม">เต็ม</option>
                            <option value="ล้นศูนย์">ล้นศูนย์</option>
                        </select>

                        <select
                            value={filterDistrict}
                            onChange={(e) => setFilterDistrict(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">อำเภอทั้งหมด</option>
                            {districts.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results count */}
                <div className="results-info">
                    พบ <strong>{centers.length}</strong> ศูนย์
                    {(search || filterCapacity || filterDistrict) && " (กรองแล้ว)"}
                </div>

                {/* Table */}
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>กำลังโหลดข้อมูล...</p>
                    </div>
                ) : centers.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">🔍</span>
                        <p>ไม่พบข้อมูลศูนย์อพยพ</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="centers-table">
                            <thead>
                                <tr>
                                    <th>ประเภท</th>
                                    <th>ชื่อศูนย์</th>
                                    <th>ที่ตั้ง</th>
                                    <th>ความจุ</th>
                                    <th>สถานะ</th>
                                    <th>ติดต่อ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {centers.map((center) => (
                                    <tr key={center._id}>
                                        <td className="type-cell">
                                            <span className="type-icon">
                                                {getShelterTypeIcon(center.shelterType)}
                                            </span>
                                            <span className="type-text">{center.shelterType || "อื่นๆ"}</span>
                                        </td>
                                        <td className="name-cell">
                                            <strong>{center.name}</strong>
                                        </td>
                                        <td className="location-cell">
                                            <div className="location-info">
                                                {center.location && <span>{center.location}</span>}
                                                {center.subdistrict && <span>ต.{center.subdistrict}</span>}
                                                {center.district && <span>อ.{center.district}</span>}
                                            </div>
                                        </td>
                                        <td className="capacity-cell">
                                            {center.capacity ? (
                                                <span className="capacity-number">
                                                    👥 {center.capacity.toLocaleString()} คน
                                                </span>
                                            ) : (
                                                <span className="capacity-unknown">ไม่ระบุ</span>
                                            )}
                                        </td>
                                        <td className="status-cell">
                                            {getStatusBadge(center.capacityStatus)}
                                        </td>
                                        <td className="contact-cell">
                                            {center.phoneNumbers && center.phoneNumbers.length > 0 ? (
                                                <div className="phone-list">
                                                    {center.phoneNumbers.slice(0, 2).map((phone, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={`tel:${phone}`}
                                                            className="phone-link"
                                                        >
                                                            📞 {phone}
                                                        </a>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="no-phone">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            <footer className="shelter-footer">
                <p>© 2025 RescueSync Platform. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
