import { useState, useEffect } from 'react';

export function usePersistentAuthState(key: string, initialValue: boolean) {
  const [value, setValue] = useState<boolean>(() => {
    const storedValue = localStorage.getItem(key);
    return (!!storedValue && storedValue != "undefined") ? JSON.parse(storedValue) : initialValue;
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value])

  return [value, setValue] as const;
}