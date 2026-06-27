import { useState } from "react";

export default function EmergencyPage() {
    const [name, setName] = useState("");
    const [status, setStatus] = useState("Safe");
    const [message, setMessage] = useState("");

    async function submitStatus() {
        await fetch ("/api/status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                name,
                status,
            }),
        });

        setMessage("Status updated successfully.");
    }

    return (
        <main className="min-h-screen bg-red-50 p-6">
            <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow">
                <h1 className="text-3xl font-bold text-red-700">
                    Emergency Mode
                </h1>

                <p className="mt-2 text-gray-600">
                    Check in so your household knows your status.
                </p>

                <input 
                    className="mt-6, w-full rounded-lg border p-3"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                
                <select 
                    className="mt-4 w-full rounded-lg border p-3"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option>Safe</option>
                    <option>Need Help</option>
                    <option>Injured</option>
                    <option>Missing</option>

                </select>

                <button onClick={submitStatus}
                className="mt-6 w-full rounded-lg bg-red-600 p-3 font-bold text-white">
                    Update My Status
                </button>

                {message && (
                    <p className="mt-4 text-green-700">{message}</p>
                )}
                
            </div>
        </main>
    );
}