import { FormEvent, useState } from 'react';

interface Props {
  room: string;
  status: 'offline' | 'connecting' | 'online';
  error: string;
  players: number;
  onJoin: (code: string) => void;
  onLeave: () => void;
}

export function ShooterMultiplayer(props: Props) {
  const [code, setCode] = useState('PVP1');

  if (props.status === 'online') {
    return (
      <div className="pvp-status">
        <span>● PvP {props.room}</span>
        <small>Соперников: {props.players}</small>
        <button onClick={props.onLeave}>Выйти</button>
      </div>
    );
  }

  const submit = (event: FormEvent) => {
    event.preventDefault();
    props.onJoin(code);
  };

  return (
    <div className="pvp-lobby">
      <form onSubmit={submit}>
        <p>ОНЛАЙН-РЕЖИМ</p>
        <h2>PvP-комната</h2>
        <label htmlFor="pvp-room">Введи одинаковый код на двух устройствах</label>
        <input
          id="pvp-room"
          value={code}
          maxLength={8}
          onChange={(event) => setCode(event.target.value)}
        />
        {props.error && <small>{props.error}</small>}
        <button type="submit" disabled={props.status === 'connecting'}>
          {props.status === 'connecting' ? 'Подключение…' : 'Войти в комнату'}
        </button>
      </form>
    </div>
  );
}
