import { describe, it, expect, beforeEach, vi } from 'vitest';
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

  it('returns empty string when localStorage.getItem throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(loadSearchTerm()).toBe('');
    spy.mockRestore();
  });

  it('silently ignores localStorage.setItem failures', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    expect(() => saveSearchTerm('boom')).not.toThrow();
    spy.mockRestore();
  });
});
