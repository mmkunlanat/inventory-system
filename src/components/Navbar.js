"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./navbar.css";

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Fetch user info
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => setUser(null));

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
    } catch (err) {
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      router.push("/login");
    }
  };

  return (
    <nav className={`main-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <span className="logo-icon">🆘</span>
          <span className="logo-text">RescueSync</span>
        </Link>

        <div className="nav-links">
          <Link href="/" className="nav-link">หน้าแรก</Link>
          {user?.role === "center" && (
            <Link href="/center/request" className="nav-link">ขอรับบริจาค</Link>
          )}
          {user?.role === "admin" && (
            <Link href="/admin/dashboard" className="nav-link">แผงควบคุม</Link>
          )}

          {!user ? (
            <Link href="/login" className="nav-link login-btn">เข้าสู่ระบบ</Link>
          ) : (
            <div className="user-nav-info">
              <span className="user-welcome">สวัสดี, {user.username} ({user.role})</span>
              <button onClick={handleLogout} className="logout-nav-btn">
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
