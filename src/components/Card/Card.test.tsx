import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Card } from './Card';
import selectedReducer from '../../store/selectedSlice';
import type { Character } from '../../types/character';

const character: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  image: 'https://example.com/rick.png',
};

function makeStore() {
  return configureStore({ reducer: { selected: selectedReducer } });
}

function renderCard(char: Character = character) {
  const store = makeStore();
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Card character={char} />
      </MemoryRouter>
    </Provider>,
  );
  return store;
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

  it('renders an unchecked checkbox by default', () => {
    renderCard();
    const checkbox = screen.getByRole('checkbox', { name: /select rick sanchez/i });
    expect(checkbox).not.toBeChecked();
  });

  it('dispatches toggleItem when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const store = renderCard();
    const checkbox = screen.getByRole('checkbox', { name: /select rick sanchez/i });
    await user.click(checkbox);
    expect(store.getState().selected.items).toHaveLength(1);
    expect(store.getState().selected.items.at(0)?.id).toBe(1);
  });

  it('unchecks when the same character is clicked again', async () => {
    const user = userEvent.setup();
    const store = renderCard();
    const checkbox = screen.getByRole('checkbox', { name: /select rick sanchez/i });
    await user.click(checkbox);
    await user.click(checkbox);
    expect(store.getState().selected.items).toHaveLength(0);
  });
});
