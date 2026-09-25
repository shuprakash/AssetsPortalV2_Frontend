import * as React from 'react';
import { createContext, useContext } from 'react';

/**
 * Simplified AppContext for standalone development.
 *
 * In the SPFx project this provides `sp: SPFI` and `context: WebPartContext`.
 * Here we provide the mock API base URL instead.
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ MIGRATION NOTE:                                                  │
 * │ When copying back to SPFx, replace this file with the original   │
 * │ AppContext.tsx that uses SPFI and WebPartContext.                 │
 * └──────────────────────────────────────────────────────────────────┘
 */
export interface IAppContext {
  apiBaseUrl: string;
}

const AppContext = createContext<IAppContext | undefined>(undefined);

export interface IAppProviderProps {
  apiBaseUrl: string;
  children: React.ReactNode;
}

export const AppProvider: React.FC<IAppProviderProps> = ({ apiBaseUrl, children }) => {
  return (
    <AppContext.Provider value={{ apiBaseUrl }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): IAppContext => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return ctx;
};
