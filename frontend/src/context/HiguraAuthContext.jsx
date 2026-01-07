import { createContext, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'higura_access_token';

const HiguraAuthContext = createContext({
  accessToken: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
});

export function HiguraAuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const value = useMemo(() => {
    return {
      accessToken,
      isAuthenticated: Boolean(accessToken),
      login: async (token) => {
        setAccessToken(token);
        try {
          localStorage.setItem(STORAGE_KEY, token);
        } catch {
          // ignore
        }
      },
      logout: () => {
        setAccessToken(null);
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore
        }
      },
    };
  }, [accessToken]);

  return <HiguraAuthContext.Provider value={value}>{children}</HiguraAuthContext.Provider>;
}

export function useHiguraAuth() {
  return useContext(HiguraAuthContext);
}

export function getHiguraAccessToken() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
