import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

const charactersPayload = {
  info: { count: 1, pages: 1, next: null, prev: null },
  results: [
    {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      image: 'https://example.com/rick.png',
    },
  ],
};

const mortyPayload = {
  info: { count: 1, pages: 1, next: null, prev: null },
  results: [
    {
      id: 2,
      name: 'Morty Smith',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      image: 'https://example.com/morty.png',
    },
  ],
};

function buildResponse(body: unknown, init: { ok?: boolean; status?: number } = {}): Response {
  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    statusText: 'mocked',
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

describe('<App />', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows loader while fetching, then renders results', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(buildResponse(charactersPayload)));

    render(<App />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('loads search term from localStorage on mount and prefills input', async () => {
    localStorage.setItem('rsschool-react-search-term', 'rick');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(buildResponse(charactersPayload)));

    render(<App />);

    expect(screen.getByRole('searchbox')).toHaveValue('rick');
    await screen.findByText('Rick Sanchez');
    expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/?name=rick');
  });

  it('saves trimmed term and refetches when user submits a new search', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(buildResponse(charactersPayload))
      .mockResolvedValueOnce(buildResponse(mortyPayload));
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<App />);
    await screen.findByText('Rick Sanchez');

    await user.clear(screen.getByRole('searchbox'));
    await user.type(screen.getByRole('searchbox'), '  morty  ');
    await user.click(screen.getByRole('button', { name: /^search$/i }));

    await screen.findByText('Morty Smith');
    expect(localStorage.getItem('rsschool-react-search-term')).toBe('morty');
    expect(fetchMock).toHaveBeenLastCalledWith(
      'https://rickandmortyapi.com/api/character/?name=morty',
    );
  });

  it('shows an error message on a 5xx server failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(buildResponse({}, { ok: false, status: 500 })),
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/server is unavailable/i);
    });
  });

  it('does not refetch when the search term has not changed', async () => {
    const fetchMock = vi.fn().mockResolvedValue(buildResponse(charactersPayload));
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<App />);
    await screen.findByText('Rick Sanchez');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /^search$/i }));

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('shows the ErrorBoundary fallback when the trigger button is clicked', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(buildResponse(charactersPayload)));
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const user = userEvent.setup();

    render(<App />);
    await screen.findByText('Rick Sanchez');

    await user.click(screen.getByRole('button', { name: /throw error/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i);
    consoleErrorSpy.mockRestore();
  });
});
