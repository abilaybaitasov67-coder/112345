interface AlertMeterProps {
  value: number;
}

export function AlertMeter({ value }: AlertMeterProps) {
  const level = value < 40 ? 'Спокойно' : value < 75 ? 'Тревожно' : 'Паника';

  return (
    <section className="alert-meter" aria-label={`Страх: ${value} процентов`}>
      <div className="alert-meter__labels">
        <span>Страх</span>
        <strong>{level} · {value}%</strong>
      </div>
      <div className="alert-meter__track">
        <div className="alert-meter__fill" style={{ width: `${value}%` }} />
      </div>
    </section>
  );
}
