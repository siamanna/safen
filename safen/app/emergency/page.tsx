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

          // Save emergency status
          await fetch("/api/status", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              status,
              note,
            }),
          });

          // Save live location
          await fetch("/api/location", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              status,
              note,
              latitude,
              longitude,
            }),
          });

          setMessage(
            "Status and live location updated successfully."
          );
        } catch (error) {
          console.error(error);

          alert("Unable to update status.");
        }

        setLoading(false);
      },
      (error) => {
        console.error(error);

        alert(
          "Unable to get your location. Please allow location access."
        );

        setLoading(false);
      }
    );
  }

  return (
    <main className="min-h-screen bg-red-50 p-6">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-4xl font-bold text-red-700">
          Emergency Mode
        </h1>

        <p className="mt-3 text-gray-600">
          Check in so your household knows your status and location.
        </p>

        {/* Name */}
        <input
          className="mt-6 w-full rounded-lg border p-3"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Status */}
        <select
          className="mt-4 w-full rounded-lg border p-3"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Safe">🟢 Safe</option>
          <option value="Need Help">🟡 Need Help</option>
          <option value="Injured">🔴 Injured</option>
          <option value="Missing">🟣 Missing</option>
        </select>

        {/* Notes */}
        <textarea
          className="mt-4 w-full rounded-lg border p-3"
          rows={4}
          placeholder="Optional notes (location details, injuries, etc.)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={submitStatus}
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-red-600 p-4 text-lg font-bold text-white transition hover:bg-red-700 disabled:bg-gray-400"
        >
          {loading
            ? "Updating Location..."
            : "Update My Status"}
        </button>

        {/* Success Message */}
        {message && (
          <div className="mt-6 rounded-lg bg-green-100 p-4 text-green-700">
            {message}
          </div>
        )}

        {/* Emergency Notice */}
        <div className="mt-8 rounded-lg border border-red-200 bg-red-100 p-4">
          <h2 className="font-bold text-red-700">
            Emergency Reminder
          </h2>

          <p className="mt-2 text-sm text-gray-700">
            If this is a life-threatening emergency, contact
            emergency services immediately.
          </p>
        </div>
      </div>
    </main>
  );
}