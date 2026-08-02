import { FormEvent, useState } from 'react';
import { askFitnessCoach } from '../lib/fitnessCoach';

interface Message { role: 'coach' | 'user'; text: string }

const starters = ['Как правильно приседать?', 'Что делать, если устал?', 'Как размяться дома?'];

export function FitnessCoach() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'coach', text: 'Привет! Я помогу с тренировкой и техникой. Если где-то болит, обязательно скажи взрослому и не продолжай через боль.' },
  ]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async (event?: FormEvent) => {
    event?.preventDefault();
    const text = question.trim();
    if (!text || loading) return;
    setMessages((items) => [...items, { role: 'user', text }]);
    setQuestion('');
    setLoading(true);
    try {
      const answer = await askFitnessCoach(text);
      setMessages((items) => [...items, { role: 'coach', text: answer }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Тренер сейчас недоступен.';
      setMessages((items) => [...items, { role: 'coach', text: message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fitness-screen coach-screen">
      <div className="fitness-title-row"><div><span className="fitness-label">УМНЫЙ ТРЕНЕР</span><h1>Спроси Forma</h1><p>Подсказки по упражнениям простыми словами.</p></div><span className="coach-online">● БЕЗОПАСНЫЙ РЕЖИМ</span></div>
      <div className="coach-chat">
        {messages.map((message, index) => <div className={`coach-message is-${message.role}`} key={index}><small>{message.role === 'coach' ? 'FORMA' : 'ТЫ'}</small><p>{message.text}</p></div>)}
        {loading && <div className="coach-message is-coach"><small>FORMA</small><p>Думаю…</p></div>}
      </div>
      <div className="coach-starters">{starters.map((text) => <button key={text} onClick={() => setQuestion(text)}>{text}</button>)}</div>
      <form className="coach-form" onSubmit={send}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Напиши вопрос тренеру…" /><button disabled={loading}>Отправить</button></form>
    </section>
  );
}
