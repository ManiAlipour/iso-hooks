import { useCallback, useSyncExternalStore } from "react";

interface UseLocalStorageOptions<T> {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  initializeWithValue?: boolean;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
) {
  const { serializer = JSON.stringify, deserializer = JSON.parse } = options;

  const subscribe = useCallback(
    (callback: () => void) => {
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === key && event.storageArea === window.localStorage) {
          callback();
        }
      };

      const handleCustomChange = (event: Event) => {
        if ((event as CustomEvent).detail?.key === key) {
          callback();
        }
      };

      window.addEventListener("storage", handleStorageChange);
      window.addEventListener("local-storage-change", handleCustomChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener("local-storage-change", handleCustomChange);
      };
    },
    [key]
  );

  const getSnapshot = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? item : serializer(initialValue);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return serializer(initialValue);
    }
  };

  const getServerSnapshot = () => serializer(initialValue);

  const storeValue = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const value = (() => {
    try {
      return deserializer(storeValue);
    } catch {
      return initialValue;
    }
  })();

  const setValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          newValue instanceof Function ? newValue(value) : newValue;

        const serializedValue = serializer(valueToStore);
        window.localStorage.setItem(key, serializedValue);

        window.dispatchEvent(
          new CustomEvent("local-storage-change", { detail: { key } })
        );
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, serializer, value]
  );

  return [value, setValue] as const;
}
