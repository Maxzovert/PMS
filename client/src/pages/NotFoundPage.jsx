import { Link } from 'react-router-dom';
import noSignal from '../assets/decor/states/No-Signal.svg';
import { PageMotion } from '../components';

export function NotFoundPage() {
  return (
    <PageMotion className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-start justify-center px-6">
      <img
        data-motion="decor"
        src={noSignal}
        alt=""
        className="mb-6 h-32 w-auto object-contain opacity-90"
      />
      <h1
        data-motion="title"
        className="font-brand text-3xl font-bold text-secondary"
      >
        Page not found
      </h1>
      <p data-motion="body" className="mt-2 font-ui text-muted">
        That URL is not part of the owner portal yet.
      </p>
      <Link
        data-motion="form"
        to="/"
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-secondary px-4 py-3 font-ui text-sm font-semibold text-surface no-underline transition hover:brightness-110"
      >
        Go home
      </Link>
    </PageMotion>
  );
}
