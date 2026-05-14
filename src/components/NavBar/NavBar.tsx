import { NavLink } from 'react-router-dom';
import styles from './NavBar.module.css';

export function NavBar(): React.JSX.Element {
  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <NavLink
        to="/"
        end
        className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
      >
        Home
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
      >
        About
      </NavLink>
    </nav>
  );
}
