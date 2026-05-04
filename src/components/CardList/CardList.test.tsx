import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardList } from './CardList';
import type { Character } from '../../types/character';

const characters: Character[] = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    image: 'https://example.com/rick.png',
  },
  {
    id: 2,
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    image: 'https://example.com/morty.png',
  },
];

describe('<CardList />', () => {
  it('renders one card per character', () => {
    render(<CardList characters={characters} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });

  it('renders a "no characters found" message for an empty array', () => {
    render(<CardList characters={[]} />);
    expect(screen.getByText(/no characters found/i)).toBeInTheDocument();
  });
});
