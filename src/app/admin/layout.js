"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "./admin-layout.css";

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
        } catch (err) {
            console.error("Logout failed", err);
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            router.push("/login");
        }
    };

    const menuItems = [
        { name: "แดชบอร์ด", path: "/admin/dashboard", icon: "📊" },
        { name: "ศูนย์ปฏิบัติการ", path: "/admin/centers", icon: "🏥" },
        { name: "สินค้าบริจาค", path: "/admin/items", icon: "📦" },
        { name: "คำขอทั้งหมด", path: "/admin/requests", icon: "📑" },
    ];

    return (
        <div className={`admin-layout ${isSidebarOpen ? "" : "sidebar-closed"}`}>
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <span className="logo-icon">🆘</span>
                        <span className="logo-text">Rescue Admin</span>
                    </div>
                    <button className="toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? "←" : "→"}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`nav-item ${pathname === item.path ? "active" : ""}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-text">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-button" onClick={handleLogout}>
                        <span className="nav-icon">🚪</span>
                        <span className="nav-text">ออกจากระบบ</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="main-wrapper">
                <header className="top-header">
                    <div className="header-search">
                        <input type="text" placeholder="ค้นหาข้อมูล..." />
                    </div>
                    <div className="header-actions">
                        <div className="notifications">🔔</div>
                        <div className="user-profile">
                            <div className="avatar">AD</div>
                            <div className="user-info">
                                <p className="name">Admin User</p>
                                <p className="role">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="content">{children}</main>
            </div>
        </div>
    );
}
