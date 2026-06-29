"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [statuses, setStatuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadStatuses() {
    try {
      const response = await fetch("/api/status", { cache: "no-store" });
      const text = await response.text();

      if (!text) {
        setStatuses([]);
        return;
      }

      setStatuses(JSON.parse(text));
    } catch (error) {
      console.error("Failed to load statuses:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStatuses();
    const interval = setInterval(loadStatuses, 5000);
    return () => clearInterval(interval);
  }, []);

  const safeCount = statuses.filter((p) => p.status === "Safe").length;
  const helpCount = statuses.filter((p) => p.status === "Need Help").length;
  const urgentCount = statuses.filter(
    (p) => p.status === "Injured" || p.status === "Missing"
  ).length;

  return (
    <main className="page">
      <div className="container">
        <section className="hero-card text-center">
          <img src="/logo.gif" alt="Safen logo" className="logo-img mx-auto" />

          <h1 className="page-title mt-4">Family Status Board</h1>

          <p className="page-subtitle">
            View real-time emergency check-ins from your household.
          </p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="card">
            <p className="text-sm font-bold text-slate-500">Safe</p>
            <h2 className="mt-2 text-4xl font-black text-green-600">
              {safeCount}
            </h2>
          </div>

          <div className="card">
            <p className="text-sm font-bold text-slate-500">Need Help</p>
            <h2 className="mt-2 text-4xl font-black text-yellow-500">
              {helpCount}
            </h2>
          </div>

          <div className="card">
            <p className="text-sm font-bold text-slate-500">Urgent</p>
            <h2 className="mt-2 text-4xl font-black text-red-600">
              {urgentCount}
            </h2>
          </div>
        </section>

        <section className="mt-8 grid gap-4">
          {loading && <div className="card">Loading statuses...</div>}

          {!loading && statuses.length === 0 && (
            <div className="card text-center">
              <h2 className="card-title">No check-ins yet</h2>
              <p className="page-subtitle">
                Go to Emergency Mode to submit your first status.
              </p>
            </div>
          )}

          {statuses.map((person) => (
            <div key={person.sk} className="card">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <h2 className="card-title">{person.name}</h2>
                  <p className="mt-1 text-slate-500">
                    {person.note || "No note provided."}
                  </p>
                </div>

                <span className="badge">{person.status}</span>
              </div>

              <p className="mt-4 text-sm text-slate-400">
                Updated:{" "}
                {person.updatedAt
                  ? new Date(person.updatedAt).toLocaleString()
                  : "Unknown"}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}