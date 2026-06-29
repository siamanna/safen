import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const valid =
    typeof body.latitude === "number" &&
    typeof body.longitude === "number" &&
    body.latitude >= -90 &&
    body.latitude <= 90 &&
    body.longitude >= -180 &&
    body.longitude <= 180;

  return NextResponse.json({
    valid,
    message: valid
      ? "Location verified successfully."
      : "Invalid location data.",
  });
}