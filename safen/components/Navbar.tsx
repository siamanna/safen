"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail(localStorage.getItem("safehaven_user_email"));
  }, []);

  function logout() {
    localStorage.removeItem("safehaven_user_email");
    localStorage.removeItem("safehaven_user_name");
    router.push("/login");
  }

  function navClass(path: string) {
    return pathname === path ? "nav-link nav-link-active" : "nav-link";
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="nav-brand">
          <img src="/logo.gif" alt="Safen logo" className="nav-logo" />
          <span>Safen</span>
        </Link>

        <div className="nav-links">
          <Link href="/" className={navClass("/")}>Home</Link>
          <Link href="/dashboard" className={navClass("/dashboard")}>Dashboard</Link>
          <Link href="/groups" className={navClass("/groups")}>Groups</Link>
          <Link href="/emergency" className={navClass("/emergency")}>Emergency</Link>
        </div>

        <div className="nav-actions">
          {email && <span className="nav-email">{email}</span>}
          <button onClick={logout} className="btn-danger nav-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}