import { useEffect, useState } from 'react';
import { event } from '../config';
function remaining() {
  const s = Math.max(0, Math.floor((new Date(event.startsAt).getTime() - Date.now()) / 1000));
  return [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
}
export function Countdown() {
  const [values, setValues] = useState(remaining);
  useEffect(() => {
    const id = window.setInterval(() => setValues(remaining()), 1000);
    return () => clearInterval(id);
  }, []);
  const started = values.every((v) => v === 0);
  return (
    <section className="countdown section-pad" aria-label="Відлік до вечірки">
      <div className="clock">
        {values.map((v, i) => (
          <div className="clock-unit" key={i}>
            <span className="clock-number">{String(v).padStart(2, '0')}</span>
            <span className="clock-label">{['днів', 'годин', 'хвилин', 'секунд'][i]}</span>
          </div>
        ))}
      </div>
      <p className="countdown-context">
        {started ? 'Наш вечір уже тут.' : 'До нашого вечора. Передчуття — теж частина свята.'}
      </p>
    </section>
  );
}
