import { useState } from 'react';
import { event, shortDate, timeLabel, eventYear } from '../config';
export function Ticket() {
  const [open, setOpen] = useState(false);
  return (
    <section className="ticket-section section-pad" aria-labelledby="ticket-title">
      <div className="ticket-intro">
        <h2 id="ticket-title" className="display">
          ЦЕЙ КВИТОК —<br />
          ТІЛЬКИ ТВІЙ.
        </h2>
        <p>У ньому є маленький секрет.</p>
      </div>
      <div className={`ticket ${open ? 'is-torn' : ''}`}>
        <div className="ticket-main">
          <div className="ticket-title">{open ? 'БЕЗ ТЕБЕ\nНІЯК.' : 'ТИ У\nСПИСКУ.'}</div>
          <div className="ticket-bottom">
            <span>
              {event.name} / {shortDate}.{eventYear.slice(-2)}
            </span>
            <span>
              {event.city} · {timeLabel}
            </span>
          </div>
        </div>
        <button
          className="ticket-stub"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="ticket-secret"
        >
          <span>{open ? 'ПОВТОРИТИ' : 'ВІДІРВИ МЕНЕ'}</span>
          <span className="barcode" aria-hidden="true" />
        </button>
      </div>
      <div className={`ticket-secret ${open ? 'visible' : ''}`} id="ticket-secret" hidden={!open}>
        <span aria-hidden="true">✳</span>
        <p>{event.secret}</p>
        <span className="signature">З любов’ю, {event.name}</span>
      </div>
    </section>
  );
}
