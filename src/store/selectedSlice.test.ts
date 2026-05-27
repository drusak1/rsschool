import { describe, it, expect } from 'vitest';
import reducer, { toggleItem, clearAll } from './selectedSlice';
import type { Character } from '../types/character';

const rick: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  image: 'https://example.com/rick.png',
};

const morty: Character = {
  id: 2,
  name: 'Morty Smith',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  image: 'https://example.com/morty.png',
};

describe('selectedSlice', () => {
  it('initial state is empty', () => {
    expect(reducer(undefined, { type: '' }).items).toHaveLength(0);
  });

  it('toggleItem adds a character when not selected', () => {
    const state = reducer(undefined, toggleItem(rick));
    expect(state.items).toHaveLength(1);
    expect(state.items.at(0)?.id).toBe(1);
  });

  it('toggleItem removes a character when already selected', () => {
    const withRick = reducer(undefined, toggleItem(rick));
    const state = reducer(withRick, toggleItem(rick));
    expect(state.items).toHaveLength(0);
  });

  it('toggleItem selects multiple independent characters', () => {
    let state = reducer(undefined, toggleItem(rick));
    state = reducer(state, toggleItem(morty));
    expect(state.items).toHaveLength(2);
    expect(state.items.map((c) => c.id)).toEqual([1, 2]);
  });

  it('clearAll removes all selected items', () => {
    let state = reducer(undefined, toggleItem(rick));
    state = reducer(state, toggleItem(morty));
    state = reducer(state, clearAll());
    expect(state.items).toHaveLength(0);
  });

  it('clearAll on empty state stays empty', () => {
    const state = reducer(undefined, clearAll());
    expect(state.items).toHaveLength(0);
  });
});
