import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <section className="text-center py-5">
      <p className="text-primary fw-bold mb-2">404</p>
      <h1 className="fw-bold mb-3">Page not found</h1>
      <p className="text-muted mb-4">The page you requested does not exist.</p>
      <Link to="/" className="btn btn-primary rounded-pill px-4">
        Return home
      </Link>
    </section>
  );
}