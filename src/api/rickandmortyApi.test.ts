import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { rickandmortyApi } from './rickandmortyApi';
import { ApiError } from './rickandmorty';

vi.mock('./rickandmorty', async (importOriginal) => {
  const mod = await importOriginal<typeof import('./rickandmorty')>();
  return { ...mod, fetchCharacters: vi.fn(), fetchCharacter: vi.fn() };
});

import { fetchCharacters, fetchCharacter } from './rickandmorty';

const rick = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive' as const,
  species: 'Human',
  type: '',
  gender: 'Male' as const,
  origin: { name: 'Earth (C-137)', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  image: 'https://example.com/rick.png',
  episode: ['ep1'],
  created: '2017-11-04',
};

function makeStore() {
  return configureStore({
    reducer: { [rickandmortyApi.reducerPath]: rickandmortyApi.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rickandmortyApi.middleware),
  });
}

describe('rickandmortyApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCharacters', () => {
    it('returns characters and totalPages on success', async () => {
      (fetchCharacters as ReturnType<typeof vi.fn>).mockResolvedValue({
        characters: [rick],
        totalPages: 5,
      });
      const store = makeStore();
      const result = await store.dispatch(
        rickandmortyApi.endpoints.getCharacters.initiate({ searchTerm: 'rick', page: 1 }),
      );
      expect(result.data).toEqual({ characters: [rick], totalPages: 5 });
    });

    it('returns CUSTOM_ERROR on ApiError', async () => {
      (fetchCharacters as ReturnType<typeof vi.fn>).mockRejectedValue(
        new ApiError('Server is unavailable. Please try again later.', 500),
      );
      const store = makeStore();
      const result = await store.dispatch(
        rickandmortyApi.endpoints.getCharacters.initiate({ searchTerm: '', page: 1 }),
      );
      expect(result.error).toEqual({
        status: 'CUSTOM_ERROR',
        error: 'Server is unavailable. Please try again later.',
      });
    });

    it('returns generic error message on unknown failure', async () => {
      (fetchCharacters as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('boom'));
      const store = makeStore();
      const result = await store.dispatch(
        rickandmortyApi.endpoints.getCharacters.initiate({ searchTerm: '', page: 1 }),
      );
      expect(result.error).toEqual({
        status: 'CUSTOM_ERROR',
        error: 'Unexpected error. Please try again.',
      });
    });

    it('calls fetchCharacters with correct args', async () => {
      (fetchCharacters as ReturnType<typeof vi.fn>).mockResolvedValue({
        characters: [],
        totalPages: 0,
      });
      const store = makeStore();
      await store.dispatch(
        rickandmortyApi.endpoints.getCharacters.initiate({ searchTerm: 'morty', page: 3 }),
      );
      expect(fetchCharacters).toHaveBeenCalledWith('morty', 3);
    });
  });

  describe('getCharacter', () => {
    it('returns character data on success', async () => {
      (fetchCharacter as ReturnType<typeof vi.fn>).mockResolvedValue(rick);
      const store = makeStore();
      const result = await store.dispatch(rickandmortyApi.endpoints.getCharacter.initiate(1));
      expect(result.data).toEqual(rick);
    });

    it('returns CUSTOM_ERROR on ApiError', async () => {
      (fetchCharacter as ReturnType<typeof vi.fn>).mockRejectedValue(
        new ApiError('Character not found (404).', 404),
      );
      const store = makeStore();
      const result = await store.dispatch(rickandmortyApi.endpoints.getCharacter.initiate(999));
      expect(result.error).toEqual({
        status: 'CUSTOM_ERROR',
        error: 'Character not found (404).',
      });
    });

    it('returns generic error message on unknown failure', async () => {
      (fetchCharacter as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('network'));
      const store = makeStore();
      const result = await store.dispatch(rickandmortyApi.endpoints.getCharacter.initiate(1));
      expect(result.error).toEqual({
        status: 'CUSTOM_ERROR',
        error: 'Failed to load character.',
      });
    });

    it('calls fetchCharacter with the given id', async () => {
      (fetchCharacter as ReturnType<typeof vi.fn>).mockResolvedValue(rick);
      const store = makeStore();
      await store.dispatch(rickandmortyApi.endpoints.getCharacter.initiate(42));
      expect(fetchCharacter).toHaveBeenCalledWith(42);
    });
  });
});
