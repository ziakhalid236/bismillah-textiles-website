import { Link } from 'wouter';

export default function NotFound() {
  return (
    <section className="not-found-page">
      <div>
        <p className="micro-label">404 / BISMILLAH TEXTILES</p>
        <h1>This page could not be found.</h1>
        <p>Check the address or return to the Bismillah Textiles homepage.</p>
        <Link className="button button-red" href="/">Back to home</Link>
      </div>
    </section>
  );
}
