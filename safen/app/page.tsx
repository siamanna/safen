import Link from "next/link";
import MapWrapper from "@/components/MapWrapper";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-orange-50">
      <section className="py-20 text-center">
        <h1 className="text-6xl font-bold text-orange-700">
          Safen
        </h1>

        <p className="mt-4 text-2xl text-gray-700">
          Your digital emergency binder before disaster happens.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-xl bg-orange-600 px-8 py-4 text-white font-bold"
          >
            Open Dashboard
          </Link>

          <Link
            href="/emergency"
            className="rounded-xl bg-red-600 px-8 py-4 text-white font-bold"
          >
            Emergency Mode
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl p-8">
        <MapWrapper />
      </section>
    </main>
  );
}