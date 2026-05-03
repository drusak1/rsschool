import { Component } from 'react';
import type { ReactNode } from 'react';
import styles from './Loader.module.css';

export class Loader extends Component {
  render(): ReactNode {
    return (
      <div className={styles.wrapper} role="status" aria-live="polite">
        <div className={styles.spinner} aria-hidden="true" />
        <span className={styles.label}>Loading...</span>
      </div>
    );
  }
}
