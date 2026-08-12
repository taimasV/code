import { Link } from 'wouter';

export function NotFoundPage() {
  return (
    <main className="container">
      <section className="hello">
        <h1>Page not found</h1>
        <p><Link href="/">Return to games</Link></p>
      </section>
    </main>
  );
}
