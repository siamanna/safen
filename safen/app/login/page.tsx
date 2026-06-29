"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  async function login() {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });

    if (!response.ok) {
      alert("Login failed.");
      return;
    }

    localStorage.setItem("safen_user_email", email.toLowerCase());
    localStorage.setItem("safen_user_name", name);

    router.push("/groups");
  }

  return (
    <main className="min-h-screen bg-orange-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-4xl font-bold text-orange-700">
          SafeHaven Login
        </h1>

        <p className="mt-2 text-gray-600">
          Create your emergency profile.
        </p>

        <input
          className="mt-6 w-full rounded-lg border p-3"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="mt-4 w-full rounded-lg border p-3"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={login}
          className="mt-6 w-full rounded-lg bg-orange-600 p-3 font-bold text-white"
        >
          Continue
        </button>
      </div>
    </main>
  );
}