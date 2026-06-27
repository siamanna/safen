import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-orange-50 p-6">
      <section className="mx-auto max-w-3xl py-20 text-center">
        <h1 className="text-5xl font-bold text-orange-700">
          SafeHaven
        </h1>

        <p className="mt-4 text-xl text-gray-700">
          Your digital emergency binder before disaster happens.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-xl bg-orange-600 px-6 py-3 font-bold text-white"
          >
            Open Dashboard
          </Link>

          <Link
            href="/emergency"
            className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white"
          >
            Emergency Mode
          </Link>
        </div>
      </section>
    </main>
  );
}