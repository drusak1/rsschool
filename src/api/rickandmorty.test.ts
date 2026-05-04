import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchCharacters, ApiError } from './rickandmorty';

const sampleResponse = {
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

function mockFetch(response: { ok: boolean; status: number; json?: unknown }): void {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: response.ok,
      status: response.status,
      statusText: 'mocked',
      json: () => Promise.resolve(response.json),
    }),
  );
}

describe('fetchCharacters', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches all characters when no search term is given', async () => {
    mockFetch({ ok: true, status: 200, json: sampleResponse });

    const result = await fetchCharacters('');

    expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/');
    expect(result.characters).toHaveLength(1);
    expect(result.totalPages).toBe(1);
  });

  it('encodes the search term in the URL', async () => {
    mockFetch({ ok: true, status: 200, json: sampleResponse });

    await fetchCharacters('rick & morty');

    expect(fetch).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character/?name=rick%20%26%20morty',
    );
  });

  it('trims whitespace from the search term', async () => {
    mockFetch({ ok: true, status: 200, json: sampleResponse });

    await fetchCharacters('  rick  ');

    expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/?name=rick');
  });

  it('returns empty results on 404 (no matches)', async () => {
    mockFetch({ ok: false, status: 404 });

    const result = await fetchCharacters('zzz');

    expect(result.characters).toEqual([]);
    expect(result.totalPages).toBe(0);
  });

  it('throws ApiError on 5xx', async () => {
    mockFetch({ ok: false, status: 500 });

    await expect(fetchCharacters('rick')).rejects.toBeInstanceOf(ApiError);
  });

  it('throws ApiError when fetch itself fails (network error)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(fetchCharacters('rick')).rejects.toBeInstanceOf(ApiError);
  });
});
