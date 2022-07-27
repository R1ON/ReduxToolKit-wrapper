import { createContext, useContext } from 'react';
import { isSSR } from './isSSR';

// ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ContextValue = any;

export const FetchContext = createContext<ContextValue | null>(null);

export const useFetchContext = <T>(useFetchId: string | null): T | null => {
  const context = useContext(FetchContext);

  if (context === null) {
    throw 'useFetchContext must be used within a FetchContext.';
  }

  if (useFetchId === null) {
    return null;
  }

  if (useFetchId in context) {
    if (isSSR) {
      return context[useFetchId];
    }

    const clone = { ...context[useFetchId] };
    delete context[useFetchId];
    return clone;
  }

  return null;
};
