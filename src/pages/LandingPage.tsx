import { Link } from 'wouter';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { useLanguage } from '../i18n/LanguageContext';
import { useCurrentUser } from '../lib/useCurrentUser';
import './landing-page.css';

export function LandingPage() {
  const { t } = useLanguage();
  const { loading, user } = useCurrentUser();
  return (
    <main className="landing-page">
      <div className="landing-orb landing-orb--one" />
      <div className="landing-orb landing-orb--two" />

      <section className="landing-card" aria-labelledby="welcome-title">
        <div className="landing-logo" aria-hidden="true">P</div>
        <span className="landing-kicker">PLAYROOM</span>
        <h1 id="welcome-title">{t('landingTitle')}</h1>
        <p>{t('landingIntro')}</p>

        <div className="landing-actions">
          {!loading && user
            ? <Link href="/games" className="landing-button landing-button--play">{t('openGames')}</Link>
            : !loading && (
              <>
                <Link href="/register" className="landing-button landing-button--primary">{t('createAccount')}</Link>
                <Link href="/login" className="landing-button landing-button--secondary">{t('signIn')}</Link>
                <GoogleSignInButton className="landing-google-button" label={t('signInGoogle')} />
                <Link href="/games" className="landing-guest-link">{t('continueGuest')} <span aria-hidden="true">→</span></Link>
              </>
            )}
        </div>
      </section>

      <p className="landing-note">{t('landingNote')}</p>
    </main>
  );
}
