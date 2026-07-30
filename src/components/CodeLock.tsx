import { FormEvent, useState } from 'react';

interface CodeLockProps {
  foundCode: string | null;
  onSubmit: (code: string) => boolean;
  onClose: () => void;
}

export function CodeLock({ foundCode, onSubmit, onClose }: CodeLockProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    const correct = onSubmit(code);
    setError(!correct);
    if (!correct) setCode('');
  }

  return (
    <div className="code-lock-backdrop">
      <form className="code-lock" onSubmit={submit}>
        <button type="button" className="code-lock__close" onClick={onClose}>×</button>
        <span className="code-lock__icon">🔒</span>
        <p className="hud-label">Кодовый замок</p>
        <h2>Введите код ворот</h2>
        <p className="code-lock__hint">
          Пароль записан в одном из карманов директора.
        </p>
        <input
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 3))}
          inputMode="numeric"
          placeholder="•••"
          autoFocus
          aria-label="Код ворот"
        />
        {foundCode && (
          <div className="code-lock__note">
            <span>📄 Записка с паролем</span>
            <strong>{foundCode}</strong>
          </div>
        )}
        {error && <p className="code-lock__error">Неверный код. Попробуй ещё раз.</p>}
        <button type="submit" disabled={code.length !== 3}>Открыть ворота</button>
      </form>
    </div>
  );
}
