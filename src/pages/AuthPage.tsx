import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Auth } from '../components/Auth';
import '../styles/auth.css';

export function AuthPage() {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="auth-intro">
      <div className="auth-intro__scene" aria-hidden="true">
        <i /><i /><i />
      </div>
      {loading ? (
        <section className="auth-loading">
          <p>ОПЕРАЦИЯ</p>
          <h1>РУБЕЖ</h1>
          <div><span /></div>
          <small>Подготовка операции…</small>
        </section>
      ) : (
        <section className="auth-panel">
          <Link href="/" className="auth-back">← Назад</Link>
          <p className="auth-panel__eyebrow">ДОПУСК К ОПЕРАЦИИ</p>
          <h1>Войти в игру</h1>
          <Auth onSuccess={() => navigate('/shooter')} />
          <button className="auth-guest" onClick={() => navigate('/shooter')}>
            Продолжить без входа
          </button>
        </section>
      )}
    </main>
  );
}
