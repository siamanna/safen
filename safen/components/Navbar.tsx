"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("safehaven_user_email")
      : null;

  function logout() {
    localStorage.removeItem("safehaven_user_email");
    localStorage.removeItem("safehaven_user_name");

    router.push("/login");
  }

  function navClass(path: string) {
    return pathname === path
      ? "bg-orange-600 text-white"
      : "text-slate-600 hover:bg-orange-100";
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-orange-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-2xl font-extrabold text-orange-600"
        >
          Safen
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className={`rounded-xl px-4 py-2 font-medium transition ${navClass("/")}`}
          >
            Home
          </Link>

          <Link
            href="/dashboard"
            className={`rounded-xl px-4 py-2 font-medium transition ${navClass("/dashboard")}`}
          >
            Dashboard
          </Link>

          <Link
            href="/groups"
            className={`rounded-xl px-4 py-2 font-medium transition ${navClass("/groups")}`}
          >
            Groups
          </Link>

          <Link
            href="/emergency"
            className={`rounded-xl px-4 py-2 font-medium transition ${navClass("/emergency")}`}
          >
            Emergency
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {email && (
            <span className="hidden rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700 md:block">
              {email}
            </span>
          )}

          <button
            onClick={logout}
            className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}