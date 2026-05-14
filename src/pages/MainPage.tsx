import { useEffect, useReducer } from 'react';
import { useSearchParams, useMatch, Outlet, useNavigate } from 'react-router-dom';
import { fetchCharacters, ApiError } from '../api/rickandmorty';
import type { Character } from '../types/character';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Search } from '../components/Search/Search';
import { CardList } from '../components/CardList/CardList';
import { Pagination } from '../components/Pagination/Pagination';
import { Loader } from '../components/Loader/Loader';
import { ErrorTrigger } from '../components/ErrorTrigger/ErrorTrigger';
import styles from './MainPage.module.css';

type FetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; characters: Character[]; totalPages: number }
  | { status: 'error'; message: string };

type FetchAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; characters: Character[]; totalPages: number }
  | { type: 'FETCH_ERROR'; message: string };

function fetchReducer(_state: FetchState, action: FetchAction): FetchState {
  switch (action.type) {
    case 'FETCH_START':
      return { status: 'loading' };
    case 'FETCH_SUCCESS':
      return { status: 'success', characters: action.characters, totalPages: action.totalPages };
    case 'FETCH_ERROR':
      return { status: 'error', message: action.message };
  }
}

const SEARCH_KEY = 'rsschool-react-search-term';

export function MainPage(): React.JSX.Element {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useLocalStorage(SEARCH_KEY, '');

  const page = Number(searchParams.get('page')) || 1;

  const [fetchState, dispatch] = useReducer(fetchReducer, { status: 'idle' });

  const detailMatch = useMatch('/character/:id');
  const hasDetail = Boolean(detailMatch);

  useEffect(() => {
    let cancelled = false;

    dispatch({ type: 'FETCH_START' });

    fetchCharacters(searchTerm, page)
      .then((result) => {
        if (cancelled) return;
        dispatch({
          type: 'FETCH_SUCCESS',
          characters: result.characters,
          totalPages: result.totalPages,
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof ApiError ? err.message : 'Unexpected error. Please try again.';
        dispatch({ type: 'FETCH_ERROR', message });
      });

    return () => {
      cancelled = true;
    };
  }, [searchTerm, page]);

  function handleSearch(value: string): void {
    setSearchTerm(value.trim());
    navigate('/?page=1');
  }

  function handlePageChange(newPage: number): void {
    const detailId = detailMatch?.params.id;
    if (detailId) {
      navigate(`/character/${detailId}?page=${newPage}`);
    } else {
      navigate(`/?page=${newPage}`);
    }
  }

  const isLoading = fetchState.status === 'loading';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Rick &amp; Morty Characters</h1>
        <Search initialValue={searchTerm} disabled={isLoading} onSearch={handleSearch} />
        <div className={styles.errorTrigger}>
          <ErrorTrigger />
        </div>
      </header>
      <div className={`${styles.content} ${hasDetail ? styles.split : ''}`}>
        <section className={styles.results}>
          {isLoading && <Loader />}
          {fetchState.status === 'error' && (
            <p className={styles.error} role="alert">
              {fetchState.message}
            </p>
          )}
          {fetchState.status === 'success' && (
            <>
              <CardList characters={fetchState.characters} />
              <Pagination
                currentPage={page}
                totalPages={fetchState.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </section>
        <Outlet />
      </div>
    </div>
  );
}
