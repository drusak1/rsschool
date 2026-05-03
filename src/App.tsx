import { Component } from 'react';
import type { ReactNode } from 'react';
import { fetchCharacters, ApiError } from './api/rickandmorty';
import type { Character } from './types/character';
import { loadSearchTerm, saveSearchTerm } from './utils/storage';
import { Search } from './components/Search/Search';
import { CardList } from './components/CardList/CardList';
import { Loader } from './components/Loader/Loader';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { ErrorTrigger } from './components/ErrorTrigger/ErrorTrigger';
import styles from './App.module.css';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface State {
  initialSearchTerm: string;
  lastSearchTerm: string;
  characters: Character[];
  status: Status;
  errorMessage: string;
}

export class App extends Component<object, State> {
  state: State = {
    initialSearchTerm: loadSearchTerm(),
    lastSearchTerm: '',
    characters: [],
    status: 'idle',
    errorMessage: '',
  };

  componentDidMount(): void {
    void this.runSearch(this.state.initialSearchTerm, { skipIfSame: false });
  }

  handleSearch = (rawValue: string): void => {
    const trimmed = rawValue.trim();
    saveSearchTerm(trimmed);
    void this.runSearch(trimmed, { skipIfSame: true });
  };

  runSearch = async (term: string, options: { skipIfSame: boolean }): Promise<void> => {
    if (
      options.skipIfSame &&
      term === this.state.lastSearchTerm &&
      this.state.status === 'success'
    ) {
      return;
    }

    this.setState({ status: 'loading', errorMessage: '' });

    try {
      const result = await fetchCharacters(term);
      this.setState({
        characters: result.characters,
        lastSearchTerm: term,
        status: 'success',
        errorMessage: '',
      });
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Unexpected error. Please try again.';
      this.setState({
        characters: [],
        lastSearchTerm: term,
        status: 'error',
        errorMessage: message,
      });
    }
  };

  renderResults(): ReactNode {
    const { status, characters, errorMessage } = this.state;

    if (status === 'loading') {
      return <Loader />;
    }
    if (status === 'error') {
      return (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      );
    }
    if (status === 'success') {
      return <CardList characters={characters} />;
    }
    return null;
  }

  render(): ReactNode {
    const isLoading = this.state.status === 'loading';

    return (
      <ErrorBoundary>
        <div className={styles.app}>
          <header className={styles.header}>
            <h1 className={styles.title}>Rick &amp; Morty Characters</h1>
            <Search
              initialValue={this.state.initialSearchTerm}
              disabled={isLoading}
              onSearch={this.handleSearch}
            />
            <div className={styles.errorTrigger}>
              <ErrorTrigger />
            </div>
          </header>
          <main className={styles.main}>{this.renderResults()}</main>
        </div>
      </ErrorBoundary>
    );
  }
}
