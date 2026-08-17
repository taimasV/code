import { Link } from 'wouter';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';
import { useCurrentUser } from '../lib/useCurrentUser';
import { NicknameEditor } from './NicknameEditor';

export function AccountControls() {
  const { t } = useLanguage();
  const { loading, user } = useCurrentUser();

  if (loading) return null;

  if (!user) {
    return (
      <div className="account-actions">
        <Link href="/login" className="account-link account-link--quiet">{t('signIn')}</Link>
        <Link href="/register" className="account-link account-link--primary">{t('register')}</Link>
      </div>
    );
  }

  return (
    <div className="account-controls">
      <NicknameEditor email={user.email} userId={user.id} />
      <button type="button" onClick={() => void supabase.auth.signOut()}>{t('signOut')}</button>
    </div>
  );
}
