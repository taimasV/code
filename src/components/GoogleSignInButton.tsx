import { useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';

type GoogleSignInButtonProps = {
  className: string;
  label?: string;
};

export function GoogleSignInButton({ className, label }: GoogleSignInButtonProps) {
  const { t } = useLanguage();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function signInWithGoogle() {
    if (!isSupabaseConfigured) {
      setMessage('Supabase is not configured yet.');
      return;
    }

    setBusy(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/games` },
      });

      if (error) {
        setMessage(error.message);
        setBusy(false);
      }
    } catch {
      setMessage(t('googleError'));
      setBusy(false);
    }
  }

  return (
    <div className="google-sign-in">
      <button className={className} type="button" onClick={() => void signInWithGoogle()} disabled={busy}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285f4" d="M21.6 12.2c0-.7-.1-1.5-.2-2.2H12v4.3h5.4a4.6 4.6 0 0 1-2 3v2.8h3.3c1.9-1.8 2.9-4.4 2.9-7.9Z" />
          <path fill="#34a853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.8a6 6 0 0 1-9-3.2H3v2.9A10 10 0 0 0 12 22Z" />
          <path fill="#fbbc05" d="M6.4 13.6a6 6 0 0 1 0-3.2V7.5H3a10 10 0 0 0 0 9l3.4-2.9Z" />
          <path fill="#ea4335" d="M12 6a5.4 5.4 0 0 1 3.8 1.5l2.9-2.8A9.7 9.7 0 0 0 3 7.5l3.4 2.9A6 6 0 0 1 12 6Z" />
        </svg>
        {busy ? t('googleOpening') : label ?? t('signInGoogle')}
      </button>
      {message && <p className="google-sign-in__message" role="status">{message}</p>}
    </div>
  );
}
