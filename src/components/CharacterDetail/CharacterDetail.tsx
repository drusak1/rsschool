import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import { useGetCharacterQuery } from '../../api/rickandmortyApi';
import { Loader } from '../Loader/Loader';
import styles from './CharacterDetail.module.css';

function getErrorMessage(error: FetchBaseQueryError | SerializedError): string {
  if ('error' in error) return String(error.error);
  return String((error as { message?: string }).message ?? 'Failed to load character.');
}

export function CharacterDetail(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { data, isFetching, error } = useGetCharacterQuery(Number(id), { skip: !id });

  function handleClose(): void {
    const page = searchParams.get('page');
    navigate(page ? `/?page=${page}` : '/');
  }

  return (
    <div className={styles.panel} data-testid="character-detail">
      <button className={styles.close} onClick={handleClose} aria-label="Close details">
        ✕
      </button>
      {isFetching && <Loader />}
      {!isFetching && error && (
        <p className={styles.error} role="alert">
          {getErrorMessage(error)}
        </p>
      )}
      {!isFetching && data && (
        <div className={styles.content}>
          <img className={styles.image} src={data.image} alt={data.name} />
          <h2 className={styles.name}>{data.name}</h2>
          <dl className={styles.details}>
            <dt>Status</dt>
            <dd>{data.status}</dd>
            <dt>Species</dt>
            <dd>{data.species}</dd>
            {data.type && (
              <>
                <dt>Type</dt>
                <dd>{data.type}</dd>
              </>
            )}
            <dt>Gender</dt>
            <dd>{data.gender}</dd>
            <dt>Origin</dt>
            <dd>{data.origin.name}</dd>
            <dt>Location</dt>
            <dd>{data.location.name}</dd>
            <dt>Episodes</dt>
            <dd>{data.episode.length}</dd>
          </dl>
        </div>
      )}
    </div>
  );
}
