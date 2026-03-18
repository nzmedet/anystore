"use client";

import Link from "next/link";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ reset }: ErrorProps) {
  return (
    <main className="anystore-login-shell">
      <section className="anystore-empty-state" style={{ width: "min(720px, 100%)" }}>
        <h3>Something broke.</h3>
        <p>The shell hit an unexpected state. Try again or return to the workspace overview.</p>
        <div className="anystore-topbar-meta" style={{ marginTop: 16 }}>
          <button type="button" className="anystore-button anystore-button-secondary" onClick={() => reset()}>
            Try again
          </button>
          <Link href="/" className="anystore-button anystore-button-secondary">
            Back to overview
          </Link>
        </div>
      </section>
    </main>
  );
}
