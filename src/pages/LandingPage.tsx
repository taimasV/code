import { Link } from 'wouter';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import './landing-page.css';

export function LandingPage() {
  return (
    <main className="landing-page">
      <div className="landing-orb landing-orb--one" />
      <div className="landing-orb landing-orb--two" />

      <section className="landing-card" aria-labelledby="welcome-title">
        <div className="landing-logo" aria-hidden="true">P</div>
        <span className="landing-kicker">PLAYROOM</span>
        <h1 id="welcome-title">Play. Think.<br />Win.</h1>
        <p>Your favorite games in one place. Create an account or start playing right now.</p>

        <div className="landing-actions">
          <Link href="/register" className="landing-button landing-button--primary">Create account</Link>
          <Link href="/login" className="landing-button landing-button--secondary">Sign in</Link>
          <GoogleSignInButton className="landing-google-button" label="Sign in with Google" />
          <Link href="/games" className="landing-guest-link">Continue as guest <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <p className="landing-note">19 games · free to play · no ads</p>
    </main>
  );
}
