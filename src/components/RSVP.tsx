import { useState } from 'react';
import type { FormEvent } from 'react';
import { event, dateLabel } from '../config';
type Response = {
  version: 1;
  name: string;
  attendance: 'yes' | 'no';
  message: string;
  plusOne: boolean;
};
const storageKey = `invitation:${event.id}:rsvp:v1`;
const empty: Response = { version: 1, name: '', attendance: 'yes', message: '', plusOne: false };
function readSaved(): Response | null {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || 'null');
    return value?.version === 1 &&
      typeof value.name === 'string' &&
      value.name.trim() &&
      ['yes', 'no'].includes(value.attendance) &&
      typeof value.message === 'string' &&
      typeof value.plusOne === 'boolean'
      ? value
      : null;
  } catch {
    return null;
  }
}
export function RSVP() {
  const [saved, setSaved] = useState<Response | null>(readSaved);
  const [form, setForm] = useState<Response>(() => saved || empty);
  const [editing, setEditing] = useState(!saved);
  const [error, setError] = useState('');
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Напиши, будь ласка, своє ім’я.');
      document.getElementById('guest-name')?.focus();
      return;
    }
    const response = { ...form, name: form.name.trim() };
    try {
      localStorage.setItem(storageKey, JSON.stringify(response));
      setSaved(response);
      setEditing(false);
      setError('');
    } catch {
      setError(
        'Браузер не дозволяє зберегти відповідь. Дозволь локальне сховище й спробуй ще раз.',
      );
    }
  };
  return (
    <section id="rsvp" className="rsvp section-pad">
      <div className="rsvp-heading">
        <h2 className="display">
          ТО ЩО,
          <br />
          <span className="outline-text">ТИ З НАМИ?</span>
        </h2>
        <p>
          Дай знати до {dateLabel(event.rsvpDeadline + 'T12:00:00+02:00')}.<br />Я прибережу для
          тебе місце в цьому вечорі.
        </p>
        <span className="rsvp-flower" aria-hidden="true">
          ✳
        </span>
      </div>
      <div className="rsvp-panel">
        {editing ? (
          <form onSubmit={submit}>
            <fieldset>
              <legend>Побачимося?</legend>
              <div className="attendance">
                <label className={form.attendance === 'yes' ? 'selected' : ''}>
                  <input
                    type="radio"
                    name="attendance"
                    value="yes"
                    checked={form.attendance === 'yes'}
                    onChange={() => setForm({ ...form, attendance: 'yes' })}
                  />
                  <span>Так, я буду</span>
                </label>
                <label className={form.attendance === 'no' ? 'selected' : ''}>
                  <input
                    type="radio"
                    name="attendance"
                    value="no"
                    checked={form.attendance === 'no'}
                    onChange={() => setForm({ ...form, attendance: 'no' })}
                  />
                  <span>Цього разу без мене</span>
                </label>
              </div>
            </fieldset>
            <label className="field-label" htmlFor="guest-name">
              Твоє ім’я <span>*</span>
            </label>
            <input
              id="guest-name"
              name="name"
              placeholder="Як тебе підписати у списку?"
              autoComplete="name"
              required
              maxLength={80}
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setError('');
              }}
              aria-describedby={error ? 'rsvp-error' : undefined}
              aria-invalid={!!error}
            />
            <label className="field-label" htmlFor="guest-message">
              Пару слів {event.nameGenitive} <span>необов’язково</span>
            </label>
            <textarea
              id="guest-message"
              name="message"
              placeholder="Побажання, улюблений трек чи просто привіт…"
              rows={2}
              maxLength={600}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            {event.allowPlusOne && (
              <label className="plus-one">
                <input
                  type="checkbox"
                  checked={form.plusOne}
                  onChange={(e) => setForm({ ...form, plusOne: e.target.checked })}
                />{' '}
                Прийду з +1
              </label>
            )}
            {error && (
              <p id="rsvp-error" role="alert">
                {error}
              </p>
            )}
            <button className="button button-lime submit" type="submit">
              Зберегти мою відповідь
            </button>
            <p className="storage-note">
              Відповідь збережеться лише в цьому браузері.
              <br />
              Щоб повідомити {event.nameAccusative}, напиши їй особисто.
            </p>
          </form>
        ) : (
          <div className="confirmation" role="status">
            <span className="confirmation-mark" aria-hidden="true">
              ✓
            </span>
            <h3>
              {saved?.attendance === 'yes'
                ? `До зустрічі, ${saved.name}!`
                : `Обіймаю, ${saved?.name}.`}
            </h3>
            <p>
              {saved?.attendance === 'yes'
                ? 'Ти у своєму списку найкращих планів на листопад.'
                : 'Ти все одно частина цього свята. Побачимось іншим разом.'}
            </p>
            <p className="storage-note">
              Це локальне збереження. {event.name} ще не отримала відповідь — напиши їй особисто.
            </p>
            <button className="text-link" onClick={() => setEditing(true)}>
              Змінити відповідь
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
