import styles from './Loader.module.css';

export function Loader(): React.JSX.Element {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true" />
      <span className={styles.label}>Loading...</span>
    </div>
  );
}
