"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./navbar.css";

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
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
          <Link href="/center/request" className="nav-link">ขอรับบริจาค</Link>
          <Link href="/admin/dashboard" className="nav-link">แผงควบคุม</Link>
          <button onClick={handleLogout} className="logout-nav-btn">
            ออกจากระบบ
          </button>
        </div>
      </div>
    </nav>
  );
}
