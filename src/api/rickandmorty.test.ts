import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchCharacters, fetchCharacter, ApiError } from './rickandmorty';

const sampleResponse = {
  info: { count: 1, pages: 3, next: null, prev: null },
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

const characterDetailPayload = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  image: 'https://example.com/rick.png',
  episode: ['ep1', 'ep2'],
  created: '2017-11-04T18:48:46.250Z',
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

  it('fetches page 1 when no search term given', async () => {
    mockFetch({ ok: true, status: 200, json: sampleResponse });

    const result = await fetchCharacters('');

    expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/?page=1');
    expect(result.characters).toHaveLength(1);
    expect(result.totalPages).toBe(3);
  });

  it('encodes the search term in the URL', async () => {
    mockFetch({ ok: true, status: 200, json: sampleResponse });

    await fetchCharacters('rick & morty');

    expect(fetch).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character/?name=rick%20%26%20morty&page=1',
    );
  });

  it('trims whitespace from the search term', async () => {
    mockFetch({ ok: true, status: 200, json: sampleResponse });

    await fetchCharacters('  rick  ');

    expect(fetch).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character/?name=rick&page=1',
    );
  });

  it('includes page number in URL', async () => {
    mockFetch({ ok: true, status: 200, json: sampleResponse });

    await fetchCharacters('rick', 2);

    expect(fetch).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character/?name=rick&page=2',
    );
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

  it('throws ApiError on non-404 4xx', async () => {
    mockFetch({ ok: false, status: 400 });

    await expect(fetchCharacters('rick')).rejects.toMatchObject({
      name: 'ApiError',
      status: 400,
    });
  });

  it('throws ApiError when fetch itself fails (network error)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(fetchCharacters('rick')).rejects.toBeInstanceOf(ApiError);
  });
});

describe('fetchCharacter', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches single character by id', async () => {
    mockFetch({ ok: true, status: 200, json: characterDetailPayload });

    const result = await fetchCharacter(1);

    expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/1');
    expect(result.name).toBe('Rick Sanchez');
    expect(result.origin.name).toBe('Earth (C-137)');
    expect(result.episode).toHaveLength(2);
  });

  it('throws ApiError when character not found', async () => {
    mockFetch({ ok: false, status: 404 });

    await expect(fetchCharacter(999)).rejects.toBeInstanceOf(ApiError);
  });

  it('throws ApiError on network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(fetchCharacter(1)).rejects.toBeInstanceOf(ApiError);
  });
});
