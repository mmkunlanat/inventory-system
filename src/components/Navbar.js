"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    setRole(sessionStorage.getItem("role"));
  }, []);

  const logout = () => {
    sessionStorage.clear();
    router.push("/login");
  };

  return (
    <nav>
      <Link href="/">Home</Link>
      {role === "admin" && <Link href="/admin">Admin</Link>}
      <button onClick={logout}>Logout</button>
    </nav>
  );
}
