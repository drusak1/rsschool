import { useState, useCallback } from 'react';

export function useLocalStorage(
  key: string,
  initialValue: string,
): [string, (value: string) => void] {
  const [storedValue, setStoredValue] = useState<string>(() => {
    try {
      return localStorage.getItem(key) ?? initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: string): void => {
      setStoredValue(value);
      try {
        localStorage.setItem(key, value);
      } catch {
        // noop
      }
    },
    [key],
  );

  return [storedValue, setValue];
}
