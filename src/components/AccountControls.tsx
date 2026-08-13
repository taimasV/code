import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Link } from 'wouter';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export function AccountControls() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    void supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  if (!user) {
    return (
      <div className="account-actions">
        <Link href="/login" className="account-link account-link--quiet">Sign in</Link>
        <Link href="/register" className="account-link account-link--primary">Register</Link>
      </div>
    );
  }

  return (
    <div className="account-controls">
      <span title={user.email}>{user.email}</span>
      <button type="button" onClick={() => void supabase.auth.signOut()}>Sign out</button>
    </div>
  );
}
