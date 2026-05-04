import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';
import type { Character } from '../../types/character';

const character: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  image: 'https://example.com/rick.png',
};

describe('<Card />', () => {
  it('renders character name', () => {
    render(<Card character={character} />);
    expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument();
  });

  it('renders description from species, status and gender', () => {
    render(<Card character={character} />);
    expect(screen.getByText('Human • Alive • Male')).toBeInTheDocument();
  });

  it('renders an image with character name as alt text', () => {
    render(<Card character={character} />);
    const image = screen.getByRole('img', { name: 'Rick Sanchez' });
    expect(image).toHaveAttribute('src', 'https://example.com/rick.png');
  });
});
