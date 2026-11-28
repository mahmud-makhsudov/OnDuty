import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows healthy when the API health check succeeds', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('Healthy', { status: 200 }));

    render(<App />);

    expect(await screen.findByText('healthy')).toBeInTheDocument();
  });

  it('shows unreachable when the API cannot be reached', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'));

    render(<App />);

    expect(await screen.findByText('unreachable')).toBeInTheDocument();
  });
});
