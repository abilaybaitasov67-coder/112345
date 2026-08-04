import { Link } from 'wouter';

export function HomePage() {
  return (
    <main className="container">
      <section className="hello">
        <p className="hello__eyebrow">Тактический онлайн-шутер</p>
        <h1>Операция «Рубеж»</h1>
        <p>Выбери оружие, сражайся с ботами или игроками и установи бомбу на точке A или B.</p>
        <Link className="home-play home-play--shooter" href="/auth">
          Начать игру →
        </Link>
      </section>
    </main>
  );
}
