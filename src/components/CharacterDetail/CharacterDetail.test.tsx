import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CharacterDetail } from './CharacterDetail';
import selectedReducer from '../../store/selectedSlice';
import { rickandmortyApi } from '../../api/rickandmortyApi';

vi.mock('../../api/rickandmorty', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../../api/rickandmorty')>();
  return { ...mod, fetchCharacter: vi.fn() };
});

import { fetchCharacter, ApiError } from '../../api/rickandmorty';

const character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive' as const,
  species: 'Human',
  type: '',
  gender: 'Male' as const,
  origin: { name: 'Earth (C-137)', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  image: 'https://example.com/rick.png',
  episode: ['ep1', 'ep2'],
  created: '2017-11-04T18:48:46.250Z',
};

function makeTestStore() {
  return configureStore({
    reducer: {
      selected: selectedReducer,
      [rickandmortyApi.reducerPath]: rickandmortyApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rickandmortyApi.middleware),
  });
}

function renderDetail(id = '1') {
  return render(
    <Provider store={makeTestStore()}>
      <MemoryRouter initialEntries={[`/character/${id}`]}>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/character/:id" element={<CharacterDetail />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe('<CharacterDetail />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loader while fetching', () => {
    (fetchCharacter as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));
    renderDetail();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders character name and details after fetch', async () => {
    (fetchCharacter as ReturnType<typeof vi.fn>).mockResolvedValue(character);
    renderDetail();

    await screen.findByText('Rick Sanchez');
    expect(screen.getByText('Alive')).toBeInTheDocument();
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders character image', async () => {
    (fetchCharacter as ReturnType<typeof vi.fn>).mockResolvedValue(character);
    renderDetail();

    await screen.findByRole('img', { name: 'Rick Sanchez' });
  });

  it('shows error when fetch fails with ApiError', async () => {
    (fetchCharacter as ReturnType<typeof vi.fn>).mockRejectedValue(
      new ApiError('Character not found (404).', 404),
    );
    renderDetail();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/character not found/i);
    });
  });

  it('shows generic error on unknown failure', async () => {
    (fetchCharacter as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('boom'));
    renderDetail();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/failed to load character/i);
    });
  });

  it('renders close button', () => {
    (fetchCharacter as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));
    renderDetail();
    expect(screen.getByRole('button', { name: /close details/i })).toBeInTheDocument();
  });

  it('navigates to home when close button is clicked', async () => {
    (fetchCharacter as ReturnType<typeof vi.fn>).mockResolvedValue(character);
    const user = userEvent.setup();
    renderDetail();

    await screen.findByText('Rick Sanchez');
    await user.click(screen.getByRole('button', { name: /close details/i }));

    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });

  it('fetches character by id from route params', async () => {
    (fetchCharacter as ReturnType<typeof vi.fn>).mockResolvedValue(character);
    renderDetail('42');

    await waitFor(() => {
      expect(fetchCharacter).toHaveBeenCalledWith(42);
    });
  });
});
