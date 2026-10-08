/*
 * auth.jsx — AuthContext + useAuth hook.
 * Wraps the temporary localStorage auth in data/users.js with React state
 * so the header icon, forms and gated UI all update together.
 */
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  login as doLogin,
  register as doRegister,
  logout as doLogout,
  currentUser,
  updateProfile as doUpdate
} from "./data/users";
import { sendEmail } from "./data/emails";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => currentUser());

  const login = useCallback((email, password) => {
    const res = doLogin(email, password);
    if (res.ok) setUser(res.user);
    return res;
  }, []);

  const register = useCallback((payload) => {
    const res = doRegister(payload);
    if (res.ok) {
      setUser(res.user);
      sendEmail({
        to: res.user.email,
        name: res.user.name,
        template: "welcome",
        data: { user: res.user }
      });
    }
    return res;
  }, []);

  const logout = useCallback(() => {
    doLogout();
    setUser(null);
  }, []);

  const update = useCallback((patch) => {
    const res = doUpdate(patch);
    if (res.ok) setUser(res.user);
    return res;
  }, []);

  const value = useMemo(
    () => ({ user, isLoggedIn: !!user, login, register, logout, update }),
    [user, login, register, logout, update]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
