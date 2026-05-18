import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import styles from './Search.module.css';

interface Props {
  initialValue: string;
  disabled: boolean;
  onSearch: (value: string) => void;
}

export function Search({ initialValue, disabled, onSearch }: Props): React.JSX.Element {
  const [value, setValue] = useState(initialValue);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setValue(event.target.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSearch(value);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} role="search">
      <input
        type="search"
        className={styles.input}
        placeholder="Search characters..."
        value={value}
        onChange={handleChange}
        disabled={disabled}
        aria-label="Search"
      />
      <button type="submit" className={styles.button} disabled={disabled}>
        Search
      </button>
    </form>
  );
}
