import { Component } from 'react';
import type { ReactNode } from 'react';
import type { Character } from '../../types/character';
import { Card } from '../Card/Card';
import styles from './CardList.module.css';

interface Props {
  characters: Character[];
}

export class CardList extends Component<Props> {
  render(): ReactNode {
    if (this.props.characters.length === 0) {
      return <p className={styles.empty}>No characters found.</p>;
    }

    return (
      <ul className={styles.grid}>
        {this.props.characters.map((character) => (
          <li key={character.id} className={styles.item}>
            <Card character={character} />
          </li>
        ))}
      </ul>
    );
  }
}
