import { NavLink } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import styles from './NavBar.module.css';

function linkClass({ isActive }: { isActive: boolean }): string | undefined {
  return isActive ? `${styles.link} ${styles.active}` : styles.link;
}

export function NavBar(): React.JSX.Element {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <NavLink to="/" end className={linkClass}>
        Home
      </NavLink>
      <NavLink to="/about" className={linkClass}>
        About
      </NavLink>
      <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </nav>
  );
}
