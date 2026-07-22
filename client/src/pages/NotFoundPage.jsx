import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="page page--not-found">
      <h1 className="page__title">Page not found</h1>
      <p className="page__lead">
        That URL is not part of the Phase 1 shell.
      </p>
      <Link to="/" className="btn btn--secondary">
        Go home
      </Link>
    </section>
  );
}
