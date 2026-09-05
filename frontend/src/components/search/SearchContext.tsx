'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

interface SearchContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SearchContext = createContext<SearchContextValue | null>(
  null,
);

export function SearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const value = useMemo(
    () => ({ open, setOpen }),
    [open],
  );

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchOverlay() {
  const value = useContext(SearchContext);

  if (!value) {
    throw new Error('useSearchOverlay needs SearchProvider');
  }

  return value;
}
