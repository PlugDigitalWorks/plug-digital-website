'use client';

import { useState, useRef, useCallback } from 'react';

export interface SearchResult {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  price?: number;
  image: string;
  brand: string;
  type: 'watch' | 'jewellery' | 'bag';
  reference?: string;
}

export interface BrandResult {
  id: string;
  name: string;
  href: string;
  type: string;
}

export interface CategoryResult {
  id: string;
  name: string;
  href: string;
  type: string;
}

interface SearchState {
  results: SearchResult[];
  brands: BrandResult[];
  categories: CategoryResult[];
}

const EMPTY_STATE: SearchState = { results: [], brands: [], categories: [] };

interface UseSearchOptions {
  limit?: number;
  debounceMs?: number;
  minLength?: number;
}

export function useSearch(options: UseSearchOptions = {}) {
  const { limit = 5, debounceMs = 350, minLength = 2 } = options;
  const [query, setQuery] = useState('');
  const [searchState, setSearchState] = useState<SearchState>(EMPTY_STATE);
  const [loading, setLoading] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const optionsRef = useRef({ limit, debounceMs, minLength });
  optionsRef.current = { limit, debounceMs, minLength };

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);

    // Clear any pending debounce timer
    if (timerRef.current) clearTimeout(timerRef.current);
    abortRef.current?.abort();

    const trimmed = value.trim();
    if (trimmed.length < optionsRef.current.minLength) {
      setSearchState(EMPTY_STATE);
      setLoading(false);
      return;
    }

    setLoading(true);

    timerRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}&limit=${optionsRef.current.limit}`,
          { signal: controller.signal },
        );
        if (!res.ok) return;
        const data = (await res.json()) as {
          results?: SearchResult[];
          brands?: BrandResult[];
          categories?: CategoryResult[];
        };
        setSearchState({
          results: data.results ?? [],
          brands: data.brands ?? [],
          categories: data.categories ?? [],
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Search fetch error:', err);
        }
      } finally {
        setLoading(false);
      }
    }, optionsRef.current.debounceMs);
  }, []);

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    abortRef.current?.abort();
    setQuery('');
    setSearchState(EMPTY_STATE);
    setLoading(false);
  }, []);

  return {
    query,
    setQuery: handleQueryChange,
    results: searchState.results,
    brands: searchState.brands,
    categories: searchState.categories,
    loading,
    clear,
  };
}
