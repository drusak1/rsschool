import styles from './AboutPage.module.css';

export function AboutPage(): React.JSX.Element {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>About</h1>
        <p className={styles.author}>
          Built by <strong>Dzmitry Rusak</strong> as part of the RS School React 2026Q2 course.
        </p>
        <a
          href="https://rs.school/react/"
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          RS School React Course →
        </a>
      </div>
    </main>
  );
}
