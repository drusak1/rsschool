export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  image: string;
}

export interface CharacterLocation {
  name: string;
  url: string;
}

export interface CharacterDetailData extends Character {
  type: string;
  origin: CharacterLocation;
  location: CharacterLocation;
  episode: string[];
  created: string;
}

export interface PageInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface CharactersResponse {
  info: PageInfo;
  results: Character[];
}

export interface CharactersErrorResponse {
  error: string;
}
