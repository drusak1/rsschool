import { Link, useSearchParams } from 'react-router-dom';
import type { Character } from '../../types/character';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleItem } from '../../store/selectedSlice';
import styles from './Card.module.css';

interface Props {
  character: Character;
}

export function Card({ character }: Props): React.JSX.Element {
  const [searchParams] = useSearchParams();
  const description = `${character.species} • ${character.status} • ${character.gender}`;
  const dispatch = useAppDispatch();
  const isSelected = useAppSelector((state) =>
    state.selected.items.some((c) => c.id === character.id),
  );

  function handleCheckboxChange(): void {
    dispatch(toggleItem(character));
  }

  return (
    <article className={styles.card}>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          aria-label={`Select ${character.name}`}
        />
      </label>
      <Link
        to={`/character/${character.id}?${searchParams.toString()}`}
        className={styles.link}
        data-testid={`card-link-${character.id}`}
      >
        <img className={styles.image} src={character.image} alt={character.name} loading="lazy" />
        <div className={styles.body}>
          <h3 className={styles.name}>{character.name}</h3>
          <p className={styles.description}>{description}</p>
        </div>
      </Link>
    </article>
  );
}
