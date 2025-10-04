import { useState, useEffect } from "react";
import { toast } from "sonner";

interface UseLocalStorageOptions<T> {
  defaultValue: T;
  storageKey: string;
}

export function useLocalStorage<T>({
  defaultValue,
  storageKey,
}: UseLocalStorageOptions<T>) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;

    try {
      const stored = window.localStorage.getItem(storageKey);
      return stored ? (JSON.parse(stored) as T) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key`, error);
      toast.error(`An unexpected error occurred while reading data`);
      return defaultValue;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing localStorage key`, error);
      toast.error(`An unexpected error occurred while saving`);
    }
  }, [storageKey, value]);

  return [value, setValue] as const;
}
