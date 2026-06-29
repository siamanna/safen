"use client";

import dynamic from "next/dynamic";

const EmergencyMap = dynamic(() => import("./EmergencyMap"), {
  ssr: false,
});

export default function MapWrapper() {
  return <EmergencyMap />;
}