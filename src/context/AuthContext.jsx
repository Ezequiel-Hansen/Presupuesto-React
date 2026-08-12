import { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import { supabase } from '../api/supabaseClient.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // evita "flashear" a /login mientras carga la sesión inicial

  useEffect(() => {
    // 1. Al montar, recupera la sesión que Supabase ya persistió en localStorage
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Se suscribe a cambios: login, logout, refresh de token, expiración, etc.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
    // no hace falta setUser/setSession acá: onAuthStateChange ya lo actualiza solo
  }, []);

  const register = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value = useMemo(
    () => ({
      user,
      token: session?.access_token ?? null, // por si algún componente todavía lo necesita
      login,
      register,
      logout,
      isAuthenticated: !!session,
      loading,
    }),
    [user, session, login, register, logout, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}