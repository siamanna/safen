"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  async function login() {
    if (!name.trim() || !email.trim()) {
      alert("Please enter your name and email.");
      return;
    }

    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    if (!response.ok) {
      alert("Login failed.");
      return;
    }

    localStorage.setItem("safehaven_user_email", email.toLowerCase());
    localStorage.setItem("safehaven_user_name", name);

    router.push("/groups");
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <img src="/logo.gif" alt="Safen logo" className="auth-logo" />

        <h1 className="page-title auth-title">Welcome to Safen</h1>
        <p className="page-subtitle">
          Create your emergency profile to join or create a safety group.
        </p>

        <input
          className="input mt-6"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input mt-4"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={login} className="btn-primary mt-6 w-full">
          Continue
        </button>
      </div>
    </main>
  );
}