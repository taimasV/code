import { Link, useLocation } from 'wouter';
import { Auth } from '../components/Auth';
import { SupabaseSetupMessage } from '../components/SupabaseSetupMessage';
import { isSupabaseConfigured } from '../lib/supabase';

type AuthPageProps = {
  mode?: 'signin' | 'signup';
};

export function AuthPage({ mode = 'signin' }: AuthPageProps) {
  const [, navigate] = useLocation();

  return (
    <main className="container auth-page">
      <Link href="/" className="back-link">← All games</Link>
      {isSupabaseConfigured
        ? <Auth initialMode={mode} onAuthenticated={() => navigate('/')} />
        : <SupabaseSetupMessage />}
    </main>
  );
}
