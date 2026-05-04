import { Component } from 'react';
import type { ReactNode } from 'react';
import type { Character } from '../../types/character';
import styles from './Card.module.css';

interface Props {
  character: Character;
}

export class Card extends Component<Props> {
  render(): ReactNode {
    const { character } = this.props;
    const description = `${character.species} • ${character.status} • ${character.gender}`;

    return (
      <article className={styles.card}>
        <img className={styles.image} src={character.image} alt={character.name} loading="lazy" />
        <div className={styles.body}>
          <h3 className={styles.name}>{character.name}</h3>
          <p className={styles.description}>{description}</p>
        </div>
      </article>
    );
  }
}
