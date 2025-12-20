"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    setRole(sessionStorage.getItem("role"));
  }, []);

  const logout = () => {
    sessionStorage.clear();
    location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" href="/">
          ระบบบริจาค
        </Link>

        <div className="navbar-nav">

          {/* เมนู Admin */}
          {role === "admin" && (
            <>
              <Link className="nav-link" href="/admin/items">สินค้า</Link>
              <Link className="nav-link" href="/admin/centers">ศูนย์อพยพ</Link>
              <Link className="nav-link" href="/admin/requests">คำขอ</Link>
            </>
          )}

          {/* เมนู Center */}
          {role === "center" && (
            <Link className="nav-link" href="/center/request">
              ขอรับบริจาค
            </Link>
          )}

          {/* ยังไม่ Login */}
          {!role && (
            <Link className="nav-link" href="/login">
              Login
            </Link>
          )}

          {/* Logout */}
          {role && (
            <button
              className="btn btn-outline-light ms-3"
              onClick={logout}
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}
