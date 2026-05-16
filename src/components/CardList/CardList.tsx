import type { Character } from '../../types/character';
import { Card } from '../Card/Card';
import styles from './CardList.module.css';

interface Props {
  characters: Character[];
}

export function CardList({ characters }: Props): React.JSX.Element {
  if (characters.length === 0) {
    return <p className={styles.empty}>No characters found.</p>;
  }

  return (
    <ul className={styles.grid}>
      {characters.map((character) => (
        <li key={character.id} className={styles.item}>
          <Card character={character} />
        </li>
      ))}
    </ul>
  );
}
