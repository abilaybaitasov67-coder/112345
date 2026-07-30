import { Link } from 'wouter';

export function HomePage() {
  return (
    <main className="container">
      <section className="hello">
        <p className="hello__eyebrow">Интерактивное приключение</p>
        <h1>Побег из медцентра</h1>
        <p>Исследуй медицинский офис, избегай охранников и найди путь на свободу.</p>
        <Link className="home-play" href="/game">Начать побег →</Link>
        <Link className="home-play home-play--shooter" href="/shooter">Играть в шутер →</Link>
        <Link className="home-auth" href="/auth">Войти или зарегистрироваться</Link>
      </section>
    </main>
  );
}
