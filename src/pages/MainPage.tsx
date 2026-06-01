import { useSearchParams, useMatch, Outlet, useNavigate } from 'react-router-dom';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import { useGetCharactersQuery } from '../api/rickandmortyApi';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SEARCH_KEY } from '../utils/storage';
import { Search } from '../components/Search/Search';
import { CardList } from '../components/CardList/CardList';
import { Pagination } from '../components/Pagination/Pagination';
import { Loader } from '../components/Loader/Loader';
import { ErrorTrigger } from '../components/ErrorTrigger/ErrorTrigger';
import styles from './MainPage.module.css';

function getErrorMessage(error: FetchBaseQueryError | SerializedError): string {
  if ('error' in error) return String(error.error);
  return String((error as { message?: string }).message ?? 'Unexpected error. Please try again.');
}

export function MainPage(): React.JSX.Element {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useLocalStorage(SEARCH_KEY, '');

  const page = Number(searchParams.get('page')) || 1;
  const detailMatch = useMatch('/character/:id');
  const hasDetail = Boolean(detailMatch);

  const { data, isFetching, error, refetch } = useGetCharactersQuery({ searchTerm, page });

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

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Rick &amp; Morty Characters</h1>
        <Search initialValue={searchTerm} disabled={isFetching} onSearch={handleSearch} />
        <div className={styles.controls}>
          <button
            className={styles.refresh}
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Refresh"
          >
            ↺ Refresh
          </button>
          <ErrorTrigger />
        </div>
      </header>
      <div className={`${styles.content} ${hasDetail ? styles.split : ''}`}>
        <section className={styles.results}>
          {isFetching && <Loader />}
          {!isFetching && error && (
            <p className={styles.error} role="alert">
              {getErrorMessage(error)}
            </p>
          )}
          {!isFetching && data && (
            <>
              <CardList characters={data.characters} />
              <Pagination
                currentPage={page}
                totalPages={data.totalPages}
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
