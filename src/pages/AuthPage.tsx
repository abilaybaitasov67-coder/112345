import { Link } from 'wouter';
import { Auth } from '../components/Auth';
import '../styles/auth.css';

export function AuthPage() {
  return (
    <main className="container auth-page">
      <header className="header">
        <Link href="/" className="auth-back">← На главную</Link>
        <h1>Аккаунт</h1>
      </header>
      <Auth />
    </main>
  );
}
