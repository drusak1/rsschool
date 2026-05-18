import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export function NotFoundPage(): React.JSX.Element {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <p className={styles.message}>Page not found.</p>
        <Link to="/" className={styles.link}>
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
