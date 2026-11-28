import { useEffect, useState } from 'react';

type ApiStatus = 'checking' | 'healthy' | 'unreachable';

const dotColor: Record<ApiStatus, string> = {
  checking: 'bg-muted',
  healthy: 'bg-signal',
  unreachable: 'bg-warn',
};

// Temporary screen that proves the web app can reach the API.
export default function App() {
  const [status, setStatus] = useState<ApiStatus>('checking');

  useEffect(() => {
    fetch('/api/health')
      .then((response) => setStatus(response.ok ? 'healthy' : 'unreachable'))
      .catch(() => setStatus('unreachable'));
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-5 py-8">
      <h1 className="font-display text-6xl leading-none uppercase">OnDuty</h1>
      <p className="flex items-center gap-2 border-y border-line py-3 font-mono text-xs uppercase">
        <span aria-hidden="true" className={`size-2 rounded-full ${dotColor[status]}`} />
        API: <span>{status}</span>
      </p>
    </main>
  );
}
