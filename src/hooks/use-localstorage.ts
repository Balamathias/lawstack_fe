import { useState, useEffect } from 'react';

/**
 * A hook that persists state in localStorage.
 * 
 * @param key The localStorage key to store the value under
 * @param initialValue The initial value to use if no value is found in localStorage
 * @returns A stateful value and a function to update it
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      
      // Handle case where item is null
      if (item === null) {
        return initialValue;
      }

      // Special handling for theme-related values
      if (key === 'theme-color' || key === 'theme-color-mode') {
        return item as unknown as T;
      }
      
      // Special handling for boolean values stored as strings
      if (key === 'using-custom-color') {
        return (item === 'true') as unknown as T;
      }
      
      // Try to parse as JSON, with fallback for simple strings
      try {
        return JSON.parse(item);
      } catch (parseError) {
        // If JSON parsing fails, return the raw string value
        return item as unknown as T;
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });
  
  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        // Special handling for theme-related values
        if (key === 'theme-color' || key === 'theme-color-mode') {
          window.localStorage.setItem(key, valueToStore as string);
        } else if (key === 'using-custom-color') {
          window.localStorage.setItem(key, String(valueToStore));
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        
        // Dispatch storage event to sync across tabs
        if (key.startsWith('theme')) {
          window.dispatchEvent(new StorageEvent('storage', {
            key: key,
            newValue: typeof valueToStore === 'string' 
              ? valueToStore 
              : JSON.stringify(valueToStore)
          }));
        }
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };
  
  // Listen for changes to this localStorage key in other tabs/windows
  useEffect(() => {
    function handleStorageChange(e: StorageEvent) {
      if (e.key === key && e.newValue !== null) {
        try {
          // Handle special cases for theme-related values
          if (key === 'theme-color' || key === 'theme-color-mode') {
            setStoredValue(e.newValue as unknown as T);
          } else if (key === 'using-custom-color') {
            setStoredValue((e.newValue === 'true') as unknown as T);
          } else {
            // Attempt to parse JSON, fallback to string value
            try {
              setStoredValue(JSON.parse(e.newValue));
            } catch {
              setStoredValue(e.newValue as unknown as T);
            }
          }
        } catch (error) {
          console.error('Error handling storage change:', error);
        }
      }
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [key]);
  
  return [storedValue, setValue];
}
