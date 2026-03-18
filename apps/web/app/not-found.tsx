import Link from "next/link";

export default function NotFound() {
  return (
    <main className="anystore-login-shell">
      <section className="anystore-empty-state" style={{ width: "min(720px, 100%)" }}>
        <h3>Page not found</h3>
        <p>The shell does not have that route yet. Return to the workspace overview and continue from there.</p>
        <div className="anystore-empty-state-action">
          <Link href="/" className="anystore-button anystore-button-secondary">
            Back to overview
          </Link>
        </div>
      </section>
    </main>
  );
}
