import { useEffect, useReducer } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchCharacter, ApiError } from '../../api/rickandmorty';
import type { CharacterDetailData } from '../../types/character';
import { Loader } from '../Loader/Loader';
import styles from './CharacterDetail.module.css';

type DetailState =
  | { status: 'loading' }
  | { status: 'success'; character: CharacterDetailData }
  | { status: 'error'; message: string };

type DetailAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; character: CharacterDetailData }
  | { type: 'FETCH_ERROR'; message: string };

function detailReducer(_state: DetailState, action: DetailAction): DetailState {
  switch (action.type) {
    case 'FETCH_START':
      return { status: 'loading' };
    case 'FETCH_SUCCESS':
      return { status: 'success', character: action.character };
    case 'FETCH_ERROR':
      return { status: 'error', message: action.message };
  }
}

export function CharacterDetail(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [state, dispatch] = useReducer(detailReducer, { status: 'loading' });

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    dispatch({ type: 'FETCH_START' });

    fetchCharacter(Number(id))
      .then((data) => {
        if (cancelled) return;
        dispatch({ type: 'FETCH_SUCCESS', character: data });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof ApiError ? err.message : 'Failed to load character.';
        dispatch({ type: 'FETCH_ERROR', message });
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  function handleClose(): void {
    const page = searchParams.get('page');
    navigate(page ? `/?page=${page}` : '/');
  }

  return (
    <div className={styles.panel} data-testid="character-detail">
      <button className={styles.close} onClick={handleClose} aria-label="Close details">
        ✕
      </button>
      {state.status === 'loading' && <Loader />}
      {state.status === 'error' && (
        <p className={styles.error} role="alert">
          {state.message}
        </p>
      )}
      {state.status === 'success' && (
        <div className={styles.content}>
          <img className={styles.image} src={state.character.image} alt={state.character.name} />
          <h2 className={styles.name}>{state.character.name}</h2>
          <dl className={styles.details}>
            <dt>Status</dt>
            <dd>{state.character.status}</dd>
            <dt>Species</dt>
            <dd>{state.character.species}</dd>
            {state.character.type && (
              <>
                <dt>Type</dt>
                <dd>{state.character.type}</dd>
              </>
            )}
            <dt>Gender</dt>
            <dd>{state.character.gender}</dd>
            <dt>Origin</dt>
            <dd>{state.character.origin.name}</dd>
            <dt>Location</dt>
            <dd>{state.character.location.name}</dd>
            <dt>Episodes</dt>
            <dd>{state.character.episode.length}</dd>
          </dl>
        </div>
      )}
    </div>
  );
}
