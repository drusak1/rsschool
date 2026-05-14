import type { Character, CharacterDetail, CharactersResponse } from '../types/character';

const API_BASE = 'https://rickandmortyapi.com/api/character';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export interface FetchCharactersResult {
  characters: Character[];
  totalPages: number;
}

export async function fetchCharacters(
  searchTerm: string,
  page: number = 1,
): Promise<FetchCharactersResult> {
  const trimmed = searchTerm.trim();
  const query = trimmed ? `?name=${encodeURIComponent(trimmed)}&page=${page}` : `?page=${page}`;
  const url = `${API_BASE}/${query}`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new ApiError('Network error. Check your connection.', 0);
  }

  if (response.status === 404) {
    return { characters: [], totalPages: 0 };
  }

  if (!response.ok) {
    if (response.status >= 500) {
      throw new ApiError('Server is unavailable. Please try again later.', response.status);
    }
    throw new ApiError(`Request failed (${response.status}).`, response.status);
  }

  const data = (await response.json()) as CharactersResponse;
  return { characters: data.results, totalPages: data.info.pages };
}

export async function fetchCharacter(id: number): Promise<CharacterDetail> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}/${id}`);
  } catch {
    throw new ApiError('Network error. Check your connection.', 0);
  }

  if (!response.ok) {
    throw new ApiError(`Character not found (${response.status}).`, response.status);
  }

  return (await response.json()) as CharacterDetail;
}
