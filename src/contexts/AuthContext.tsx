import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session, User as SbUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface AppUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function buildAppUser(sbUser: SbUser | null): Promise<AppUser | null> {
  if (!sbUser) return null;
  // Look up role in user_roles (deferred to avoid blocking auth callback)
  const { data: roleRow } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', sbUser.id)
    .eq('role', 'admin')
    .maybeSingle();
  return {
    id: sbUser.id,
    email: sbUser.email || '',
    role: roleRow ? 'admin' : 'user',
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      // Defer DB call to avoid deadlock inside callback
      if (newSession?.user) {
        setTimeout(() => {
          buildAppUser(newSession.user).then(setUser);
        }, 0);
      } else {
        setUser(null);
      }
    });

    // 2. THEN getSession
    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      setSession(existing);
      if (existing?.user) {
        buildAppUser(existing.user).then((u) => {
          setUser(u);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl },
    });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error: error?.message ?? null };
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error: error?.message ?? null };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signUp, signOut, resetPassword, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
