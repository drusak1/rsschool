import { describe, it, expect, vi } from 'vitest';
import { generateCSVContent, downloadCSV } from './csv';
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

describe('generateCSVContent', () => {
  it('first row contains correct headers', () => {
    const lines = generateCSVContent([rick]).split('\n');
    expect(lines[0]).toBe('"id","name","status","species","gender","url"');
  });

  it('data row contains correct character values', () => {
    const lines = generateCSVContent([rick]).split('\n');
    expect(lines[1]).toContain('"1"');
    expect(lines[1]).toContain('"Rick Sanchez"');
    expect(lines[1]).toContain('"Alive"');
    expect(lines[1]).toContain('"Human"');
    expect(lines[1]).toContain('"Male"');
    expect(lines[1]).toContain('rickandmortyapi.com/api/character/1');
  });

  it('includes a row per character', () => {
    const lines = generateCSVContent([rick, morty]).split('\n');
    expect(lines).toHaveLength(3); // header + 2 rows
  });

  it('escapes double quotes in values', () => {
    const tricky: Character = { ...rick, name: 'Rick "The Genius" Sanchez' };
    const content = generateCSVContent([tricky]);
    expect(content).toContain('"Rick ""The Genius"" Sanchez"');
  });
});

describe('downloadCSV', () => {
  it('triggers a file download with correct filename', () => {
    const createObjectURL = vi.fn(() => 'blob:mock');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });

    const mockAnchor = { href: '', download: '', click: vi.fn() };
    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockImplementationOnce(() => mockAnchor as unknown as HTMLAnchorElement);

    downloadCSV([rick, morty]);

    expect(mockAnchor.download).toBe('2_items.csv');
    expect(createObjectURL).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock');
    expect(mockAnchor.click).toHaveBeenCalled();

    createElementSpy.mockRestore();
    vi.unstubAllGlobals();
  });
});
