import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { GoogleSignInButton } from './GoogleSignInButton';
import { useLanguage } from '../i18n/LanguageContext';

type AuthProps = {
  initialMode?: AuthMode;
  onAuthenticated: () => void;
};

type AuthMode = 'signin' | 'signup';

export function Auth({ initialMode = 'signin', onAuthenticated }: AuthProps) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (mode === 'signup' && password !== passwordConfirmation) {
      setMessage(t('passwordsMismatch'));
      return;
    }

    setBusy(true);
    try {
      const result = mode === 'signup'
        ? await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/login` },
          })
        : await supabase.auth.signInWithPassword({ email, password });

      if (result.error) {
        setMessage(result.error.message);
      } else if (mode === 'signup' && !result.data.session) {
        setMessage(t('checkEmail'));
      } else {
        onAuthenticated();
      }
    } catch {
      setMessage(t('connectionError'));
    } finally {
      setBusy(false);
    }
  }

  function switchMode() {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setPassword('');
    setPasswordConfirmation('');
    setMessage('');
  }

  return (
    <section className="auth-card">
      <span className="eyebrow">{t('playerAccount')}</span>
      <h1>{mode === 'signin' ? t('welcomeBack') : t('authCreateTitle')}</h1>
      <p className="auth-intro">
        {mode === 'signin' ? t('signInIntro') : t('registerIntro')}
      </p>

      <GoogleSignInButton className="auth-google-button" />
      <div className="auth-divider"><span>{t('orEmail')}</span></div>

      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          {t('email')}
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          {t('password')}
          <input
            type="password"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            placeholder={t('passwordHint')}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />
        </label>
        {mode === 'signup' && (
          <label>
            {t('repeatPassword')}
            <input
              type="password"
              autoComplete="new-password"
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              minLength={6}
              required
            />
          </label>
        )}
        <button className={`auth-submit auth-submit--${mode}`} type="submit" disabled={busy}>
          {busy ? t('pleaseWait') : mode === 'signin' ? t('signIn') : t('createAccount')}
        </button>
      </form>

      {message && <p className="auth-message" role="status">{message}</p>}
      <button className={`auth-switch ${mode === 'signin' ? 'auth-switch--register' : ''}`} type="button" onClick={switchMode}>
        {mode === 'signin' ? t('noAccount') : t('alreadyRegistered')}
      </button>
    </section>
  );
}
