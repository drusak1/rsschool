export const SEARCH_KEY = 'rsschool-react-search-term';

export function loadSearchTerm(): string {
  try {
    return localStorage.getItem(SEARCH_KEY) ?? '';
  } catch {
    return '';
  }
}

export function saveSearchTerm(value: string): void {
  try {
    localStorage.setItem(SEARCH_KEY, value);
  } catch {
    // noop
  }
}
