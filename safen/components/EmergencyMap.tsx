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
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
}

export default function EmergencyMap() {
  const [people, setPeople] = useState<PersonLocation[]>([]);

  async function loadLocations() {
    const response = await fetch("/api/location");
    const data = await response.json();
    setPeople(data);
  }

  useEffect(() => {
    loadLocations();

    const interval = setInterval(loadLocations, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer
      center={[43.2081, -70.8737]}
      zoom={12}
      style={{
        height: "600px",
        width: "100%",
        borderRadius: "20px",
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {people.map((person) => (
        <Marker
          key={person.name}
          position={[person.latitude, person.longitude]}
          icon={getIcon(person.status)}
        >
          <Popup>
            <strong>{person.name}</strong>
            <br />
            {person.status}
            <br />
            Updated: {new Date(person.updatedAt).toLocaleTimeString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}