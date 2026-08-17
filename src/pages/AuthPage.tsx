import { Link, useLocation } from 'wouter';
import { Auth } from '../components/Auth';
import { SupabaseSetupMessage } from '../components/SupabaseSetupMessage';
import { isSupabaseConfigured } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';

type AuthPageProps = {
  mode?: 'signin' | 'signup';
};

export function AuthPage({ mode = 'signin' }: AuthPageProps) {
  const [, navigate] = useLocation();
  const { t } = useLanguage();

  return (
    <main className="container auth-page">
      <Link href="/" className="back-link">{t('backHome')}</Link>
      {isSupabaseConfigured
        ? <Auth initialMode={mode} onAuthenticated={() => navigate('/games')} />
        : <SupabaseSetupMessage />}
    </main>
  );
}
