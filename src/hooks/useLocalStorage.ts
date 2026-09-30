import { useEffect, useState } from 'react';

export function useLocalStorage<T>(
    key: string,
    initialValue: T | (() => T),
    validate?: (value: unknown) => value is T,
) {
    const getInitialValue = () => {
        const fallback = typeof initialValue === 'function'
            ? (initialValue as () => T)()
            : initialValue;

        try {
            const storedValue = localStorage.getItem(key);
            if (storedValue === null) return fallback;
            const parsedValue: unknown = JSON.parse(storedValue);
            if (validate === undefined) return parsedValue as T;
            return validate(parsedValue) ? parsedValue : fallback;
        } catch {
            return fallback;
        }
    };

    const [value, setValue] = useState<T>(getInitialValue);

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // Storage can be unavailable or full; the in-memory state remains usable.
        }
    }, [key, value]);

    return [value, setValue] as const;
}