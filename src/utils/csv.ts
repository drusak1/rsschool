import type { Character } from '../types/character';

export function generateCSVContent(characters: Character[]): string {
  const headers = ['id', 'name', 'status', 'species', 'gender', 'url'];
  const rows = characters.map((c) => [
    String(c.id),
    c.name,
    c.status,
    c.species,
    c.gender,
    `https://rickandmortyapi.com/api/character/${c.id}`,
  ]);
  return [headers, ...rows]
    .map((row) => row.map((v) => `"${v.replace(/"/g, '""')}"`).join(','))
    .join('\n');
}

export function downloadCSV(characters: Character[]): void {
  const content = generateCSVContent(characters);
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${characters.length}_items.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
