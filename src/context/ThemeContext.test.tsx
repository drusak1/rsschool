import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from './ThemeContext';
import { useTheme } from '../hooks/useTheme';

function ThemeConsumer(): React.JSX.Element {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </>
  );
}

function renderWithTheme() {
  return render(
    <ThemeProvider>
      <ThemeConsumer />
    </ThemeProvider>,
  );
}

describe('ThemeContext', () => {
  it('default theme is light', () => {
    renderWithTheme();
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('toggles to dark on button click', async () => {
    const user = userEvent.setup();
    renderWithTheme();
    await user.click(screen.getByRole('button', { name: /toggle/i }));
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('toggles back to light from dark', async () => {
    const user = userEvent.setup();
    renderWithTheme();
    await user.click(screen.getByRole('button', { name: /toggle/i }));
    await user.click(screen.getByRole('button', { name: /toggle/i }));
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('sets data-theme attribute on documentElement', async () => {
    const user = userEvent.setup();
    renderWithTheme();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    await user.click(screen.getByRole('button', { name: /toggle/i }));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('throws when used outside ThemeProvider', () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme must be used within ThemeProvider',
    );
  });
});
