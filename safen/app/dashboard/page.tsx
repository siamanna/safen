"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [statuses, setStatuses] = useState<any[]>([]);

  async function loadStatuses() {
    const response = await fetch("/api/status");
    const data = await response.json();
    setStatuses(data);
  }

  useEffect(() => {
    loadStatuses();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold">Family Status Board</h1>

      <div className="mt-6 grid gap-4">
        {statuses.map((person) => (
          <div key={person.sk} className="rounded-xl bg-white p-4 shadow">
            <h2 className="text-xl font-bold">{person.name}</h2>
            <p className="text-lg text-gray-700">{person.status}</p>
            <p className="text-gray-500">{person.note}</p>
            <p className="mt-2 text-sm text-gray-400">
              Updated: {person.updatedAt}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}