import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Search } from './Search';

describe('<Search />', () => {
  it('renders with the initial value', () => {
    render(<Search initialValue="rick" disabled={false} onSearch={vi.fn()} />);
    expect(screen.getByRole('searchbox')).toHaveValue('rick');
  });

  it('updates input value as the user types', async () => {
    const user = userEvent.setup();
    render(<Search initialValue="" disabled={false} onSearch={vi.fn()} />);

    const input = screen.getByRole('searchbox');
    await user.type(input, 'morty');

    expect(input).toHaveValue('morty');
  });

  it('calls onSearch with the typed value when submitting', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<Search initialValue="" disabled={false} onSearch={onSearch} />);

    await user.type(screen.getByRole('searchbox'), 'summer');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('summer');
  });

  it('submits on Enter key', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<Search initialValue="beth" disabled={false} onSearch={onSearch} />);

    await user.type(screen.getByRole('searchbox'), '{Enter}');

    expect(onSearch).toHaveBeenCalledWith('beth');
  });

  it('disables input and button when disabled prop is true', () => {
    render(<Search initialValue="" disabled={true} onSearch={vi.fn()} />);
    expect(screen.getByRole('searchbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: /search/i })).toBeDisabled();
  });
});
