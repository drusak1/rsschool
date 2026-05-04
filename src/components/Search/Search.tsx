import { Component } from 'react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import styles from './Search.module.css';

interface Props {
  initialValue: string;
  disabled: boolean;
  onSearch: (value: string) => void;
}

interface State {
  value: string;
}

export class Search extends Component<Props, State> {
  state: State = { value: this.props.initialValue };

  handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    this.props.onSearch(this.state.value);
  };

  render(): ReactNode {
    return (
      <form className={styles.form} onSubmit={this.handleSubmit} role="search">
        <input
          type="search"
          className={styles.input}
          placeholder="Search characters..."
          value={this.state.value}
          onChange={this.handleChange}
          disabled={this.props.disabled}
          aria-label="Search"
        />
        <button type="submit" className={styles.button} disabled={this.props.disabled}>
          Search
        </button>
      </form>
    );
  }
}
