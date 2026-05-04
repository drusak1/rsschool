import { describe, it, expect, beforeEach } from 'vitest';
import { loadSearchTerm, saveSearchTerm } from './storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty string when nothing is stored', () => {
    expect(loadSearchTerm()).toBe('');
  });

  it('persists and retrieves a search term', () => {
    saveSearchTerm('rick');
    expect(loadSearchTerm()).toBe('rick');
  });

  it('overwrites a previously stored term', () => {
    saveSearchTerm('rick');
    saveSearchTerm('morty');
    expect(loadSearchTerm()).toBe('morty');
  });
});
