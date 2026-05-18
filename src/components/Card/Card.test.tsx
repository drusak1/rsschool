import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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

function renderCard(char: Character = character) {
  return render(
    <MemoryRouter>
      <Card character={char} />
    </MemoryRouter>,
  );
}

describe('<Card />', () => {
  it('renders character name', () => {
    renderCard();
    expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument();
  });

  it('renders description from species, status and gender', () => {
    renderCard();
    expect(screen.getByText('Human • Alive • Male')).toBeInTheDocument();
  });

  it('renders an image with character name as alt text', () => {
    renderCard();
    const image = screen.getByRole('img', { name: 'Rick Sanchez' });
    expect(image).toHaveAttribute('src', 'https://example.com/rick.png');
  });

  it('renders a link to the character detail page', () => {
    renderCard();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/character/1');
  });
});
