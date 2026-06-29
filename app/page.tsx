import Link from "next/link";
import MapWrapper from "@/components/MapWrapper";

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <div className="logo-wrap">
          <img src="/logo.gif" alt="Safen logo" className="logo-img" />
        </div>

        <h1 className="page-title">Safen</h1>

        <p className="page-subtitle">
          Real-time emergency coordination for families, roommates, and communities.
        </p>

        <div className="mt-5">
          <span className="badge">Live location • Safety status • Emergency messaging</span>
        </div>

        <div className="btn-row mt-8">
          <Link href="/dashboard" className="btn-primary">
            Open Dashboard
          </Link>

          <Link href="/emergency" className="btn-danger">
            Emergency Mode
          </Link>
        </div>
      </section>

      <section className="container">
        <MapWrapper />
      </section>
    </main>
  );
}