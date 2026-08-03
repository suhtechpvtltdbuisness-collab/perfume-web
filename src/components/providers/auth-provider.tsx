"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  authApi,
  type AuthResponse,
  type AuthUser,
} from "@/lib/auth-api";

const tokenKey = "autoroma-access-token";
const refreshKey = "autoroma-refresh-token";
const userKey = "autoroma-user";

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isReady: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
  adminLogin: (password: string, email?: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function persist(session: AuthResponse | null) {
  if (!session) {
    window.localStorage.removeItem(tokenKey);
    window.localStorage.removeItem(refreshKey);
    window.localStorage.removeItem(userKey);
    return;
  }
  window.localStorage.setItem(tokenKey, session.accessToken);
  window.localStorage.setItem(refreshKey, session.refreshToken);
  window.localStorage.setItem(userKey, JSON.stringify(session.user));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const hydrate = window.setTimeout(async () => {
      try {
        const token = window.localStorage.getItem(tokenKey);
        const storedUser = window.localStorage.getItem(userKey);
        if (!token) return;

        setAccessToken(token);
        if (storedUser) setUser(JSON.parse(storedUser) as AuthUser);

        const { user: fresh } = await authApi.me(token);
        setUser(fresh);
        window.localStorage.setItem(userKey, JSON.stringify(fresh));
      } catch {
        persist(null);
        setUser(null);
        setAccessToken(null);
      } finally {
        setIsReady(true);
      }
    }, 0);

    return () => window.clearTimeout(hydrate);
  }, []);

  const applySession = useCallback((session: AuthResponse) => {
    persist(session);
    setUser(session.user);
    setAccessToken(session.accessToken);
    return session.user;
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const session = await authApi.login({ email, password });
      return applySession(session);
    },
    [applySession],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const session = await authApi.register({ name, email, password });
      return applySession(session);
    },
    [applySession],
  );

  const adminLogin = useCallback(
    async (password: string, email?: string) => {
      const session = await authApi.adminLogin({ password, email });
      return applySession(session);
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout(accessToken);
    } catch {
      // ignore network errors on logout
    }
    persist(null);
    setUser(null);
    setAccessToken(null);
  }, [accessToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isReady,
      isAuthenticated: Boolean(user && accessToken),
      login,
      register,
      adminLogin,
      logout,
    }),
    [user, accessToken, isReady, login, register, adminLogin, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
