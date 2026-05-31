import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { fetchCharacters, fetchCharacter, ApiError } from './rickandmorty';
import type { Character, CharacterDetailData } from '../types/character';

const CACHE_TTL = Number(import.meta.env.VITE_CACHE_TTL) || 60;

export interface GetCharactersArg {
  searchTerm: string;
  page: number;
}

export interface GetCharactersResult {
  characters: Character[];
  totalPages: number;
}

export const rickandmortyApi = createApi({
  reducerPath: 'rickandmortyApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://rickandmortyapi.com/api/' }),
  keepUnusedDataFor: CACHE_TTL,
  endpoints: (builder) => ({
    getCharacters: builder.query<GetCharactersResult, GetCharactersArg>({
      queryFn: async ({ searchTerm, page }) => {
        try {
          const data = await fetchCharacters(searchTerm, page);
          return { data };
        } catch (err) {
          const message =
            err instanceof ApiError ? err.message : 'Unexpected error. Please try again.';
          return { error: { status: 'CUSTOM_ERROR' as const, error: message } };
        }
      },
    }),
    getCharacter: builder.query<CharacterDetailData, number>({
      queryFn: async (id) => {
        try {
          const data = await fetchCharacter(id);
          return { data };
        } catch (err) {
          const message = err instanceof ApiError ? err.message : 'Failed to load character.';
          return { error: { status: 'CUSTOM_ERROR' as const, error: message } };
        }
      },
    }),
  }),
});

export const { useGetCharactersQuery, useGetCharacterQuery } = rickandmortyApi;
