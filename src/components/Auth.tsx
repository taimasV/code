import { useState } from 'react';
import { supabase } from '../lib/supabase';

type AuthProps = {
  initialMode?: AuthMode;
  onAuthenticated: () => void;
};

type AuthMode = 'signin' | 'signup';

export function Auth({ initialMode = 'signin', onAuthenticated }: AuthProps) {
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
      setMessage('Passwords do not match.');
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
        setMessage('Check your email and follow the confirmation link.');
      } else {
        onAuthenticated();
      }
    } catch {
      setMessage('Could not connect. Check your internet connection and try again.');
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
      <span className="eyebrow">Player account</span>
      <h1>{mode === 'signin' ? 'Welcome back' : 'Create an account'}</h1>
      <p className="auth-intro">
        {mode === 'signin' ? 'Sign in to continue playing.' : 'Register with your email and password.'}
      </p>

      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Email
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
          Password
          <input
            type="password"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            placeholder="At least 6 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />
        </label>
        {mode === 'signup' && (
          <label>
            Repeat password
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
        <button className="auth-submit" type="submit" disabled={busy}>
          {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      {message && <p className="auth-message" role="status">{message}</p>}
      <button className="auth-switch" type="button" onClick={switchMode}>
        {mode === 'signin' ? 'No account? Register' : 'Already registered? Sign in'}
      </button>
    </section>
  );
}
