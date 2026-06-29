"use client";

import { useState } from "react";

export default function EmergencyPage() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Safe");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitStatus() {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setMessage("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const locationTest = await fetch("/api/location/validator", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude, longitude }),
          });

          const testResult = await locationTest.json();

          if (!testResult.valid) {
            alert("Location verification failed.");
            setLoading(false);
            return;
          }

          await fetch("/api/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, status, note }),
          });

          await fetch("/api/location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              status,
              note,
              latitude,
              longitude,
            }),
          });

          setMessage("Status and live location updated successfully.");
        } catch (error) {
          console.error(error);
          alert("Unable to update status.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        alert("Unable to get your location. Please allow location access.");
        setLoading(false);
      }
    );
  }

  return (
    <main className="emergency-active">
      <section className="page">
        <div className="emergency-card mx-auto max-w-xl rounded-3xl p-8">
          <img src="/logo.gif" alt="Safen logo" className="auth-logo" />

          <h1 className="text-center text-4xl font-black text-red-700">
            Emergency Mode
          </h1>

          <p className="mt-3 text-center text-gray-600">
            Share your status and verified location with your emergency group.
          </p>

          <input
            className="input mt-6"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="input mt-4"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Safe">🟢 Safe</option>
            <option value="Need Help">🟡 Need Help</option>
            <option value="Injured">🔴 Injured</option>
            <option value="Missing">🟣 Missing</option>
          </select>

          <textarea
            className="input mt-4"
            rows={4}
            placeholder="Optional notes: injuries, location details, what happened..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <button
            onClick={submitStatus}
            disabled={loading}
            className="btn-danger mt-6 w-full"
          >
            {loading ? "Verifying Location..." : "Update My Emergency Status"}
          </button>

          {message && <div className="success-box mt-6">{message}</div>}

          <div className="warning-box mt-8">
            <h2 className="font-black">Emergency Reminder</h2>
            <p className="mt-2 text-sm">
              If this is life-threatening, call emergency services immediately.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}