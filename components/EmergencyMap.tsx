"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

type PersonLocation = {
  name: string;
  status: string;
  latitude: number;
  longitude: number;
  updatedAt: string;
};

function getIcon(status: string) {
  const color =
    status === "Safe"
      ? "green"
      : status === "Need Help"
      ? "yellow"
      : status === "Injured"
      ? "red"
      : "violet";

  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
}

export default function EmergencyMap() {
  const [people, setPeople] = useState<PersonLocation[]>([]);
  const [error, setError] = useState("");

  async function loadLocations() {
    try {
      const response = await fetch("/api/location", { cache: "no-store" });
      const text = await response.text();

      if (!response.ok) {
        setError("Unable to load locations.");
        console.error(text);
        return;
      }

      if (!text) {
        setPeople([]);
        return;
      }

      setPeople(JSON.parse(text));
      setError("");
    } catch (err) {
      console.error("Failed to load locations:", err);
      setError("Waiting for location updates...");
    }
  }

  useEffect(() => {
    loadLocations();
    const interval = setInterval(loadLocations, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="map-shell">
      <div className="map-header">
        <div>
          <h2>Live Household Map</h2>
          <p>Location and safety statuses refresh every 5 seconds.</p>
        </div>
        <span className="live-pill">● Live</span>
      </div>

      {error && <div className="warning-box">{error}</div>}

      <div className="map-card">
        <MapContainer center={[43.2081, -70.8737]} zoom={12} className="safen-map">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {people.map((person) => (
            <Marker
              key={`${person.name}-${person.updatedAt}`}
              position={[person.latitude, person.longitude]}
              icon={getIcon(person.status)}
            >
              <Popup>
                <strong>{person.name}</strong>
                <br />
                {person.status}
                <br />
                Updated:{" "}
                {person.updatedAt
                  ? new Date(person.updatedAt).toLocaleTimeString()
                  : "Unknown"}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}