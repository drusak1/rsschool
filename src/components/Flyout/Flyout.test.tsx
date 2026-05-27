import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Flyout } from './Flyout';
import selectedReducer, { toggleItem } from '../../store/selectedSlice';
import type { Character } from '../../types/character';

const rick: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  image: 'https://example.com/rick.png',
};

const morty: Character = {
  id: 2,
  name: 'Morty Smith',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  image: 'https://example.com/morty.png',
};

function makeStore(items: Character[] = []) {
  const store = configureStore({ reducer: { selected: selectedReducer } });
  items.forEach((c) => store.dispatch(toggleItem(c)));
  return store;
}

function renderFlyout(items: Character[] = []) {
  const store = makeStore(items);
  render(
    <Provider store={store}>
      <Flyout />
    </Provider>,
  );
  return store;
}

describe('<Flyout />', () => {
  it('renders nothing when no items are selected', () => {
    const { container } = render(
      <Provider store={makeStore()}>
        <Flyout />
      </Provider>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('shows singular count for one item', () => {
    renderFlyout([rick]);
    expect(screen.getByText('1 item selected')).toBeInTheDocument();
  });

  it('shows plural count for multiple items', () => {
    renderFlyout([rick, morty]);
    expect(screen.getByText('2 items selected')).toBeInTheDocument();
  });

  it('renders "Unselect all" and "Download" buttons', () => {
    renderFlyout([rick]);
    expect(screen.getByRole('button', { name: /unselect all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
  });

  it('clears all items on "Unselect all" click', async () => {
    const user = userEvent.setup();
    const store = renderFlyout([rick, morty]);
    await user.click(screen.getByRole('button', { name: /unselect all/i }));
    expect(store.getState().selected.items).toHaveLength(0);
  });

  it('calls download when "Download" is clicked', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock'),
      revokeObjectURL: vi.fn(),
    });
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);

    renderFlyout([rick]);
    await user.click(screen.getByRole('button', { name: /download/i }));

    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
    vi.unstubAllGlobals();
  });
});
