import { useCallback, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Opening } from './components/Opening';
import { Countdown } from './components/Countdown';
import { Gallery } from './components/Gallery';
import { Ticket } from './components/Ticket';
import { RSVP } from './components/RSVP';
import { useMotionPreference } from './hooks/useMotionPreference';
import {
  dateLabel,
  event,
  locationLabel,
  routeUrl,
  shortDate,
  timeLabel,
  weekdayLabel,
  eventYear,
} from './config';
import { downloadCalendar } from './calendar';
gsap.registerPlugin(ScrollTrigger, useGSAP);
function Star({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path d="M50 0v100M0 50h100M15 15l70 70M15 85l70-70" stroke="currentColor" strokeWidth="11" />
    </svg>
  );
}
function App() {
  const [opening, setOpening] = useState(true);
  const closeOpening = useCallback(() => {
    setOpening(false);
    requestAnimationFrame(() =>
      document.getElementById('hero-title')?.focus({ preventScroll: true }),
    );
  }, []);
  const root = useRef<HTMLDivElement>(null);
  const reduced = useMotionPreference();
  useGSAP(
    () => {
      if (opening || reduced) return;
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero-line > span', { yPercent: 110, duration: 0.8, stagger: 0.11 })
        .from('.hero-photo', { rotation: 0, y: 35, duration: 0.8 }, 0.1)
        .from('.hero-bottom', { y: 15, opacity: 0, duration: 0.5 }, 0.5);
      root.current?.querySelectorAll('.section-heading .display, .message-copy').forEach((el) =>
        gsap.from(el, {
          y: 36,
          duration: 0.8,
          scrollTrigger: { trigger: el, start: 'top 94%', once: true },
        }),
      );
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        gsap.to('.photo-1', {
          y: -26,
          ease: 'none',
          scrollTrigger: {
            trigger: '.photo-strip',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [opening, reduced], revertOnUpdate: true },
  );
  const playOpening = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setOpening(true);
  };
  return (
    <div ref={root}>
      <a className="skip-link" href="#main">
        До запрошення
      </a>
      <header className="header">
        <a
          className="wordmark"
          href="#main"
          aria-label={`с.${shortDate}.${eventYear.slice(-2)} — ${event.name}, до початку`}
        >
          с<span className="brand-dot">.</span>
          <span className="wordmark-date">
            {shortDate}.{eventYear.slice(-2)}
          </span>
        </a>
        <nav aria-label="Основна навігація">
          <a href="#details">Деталі</a>
          <a href="#mood">Настрій</a>
          <a className="nav-rsvp" href="#rsvp">
            Я буду <span>↗</span>
          </a>
        </nav>
      </header>
      <main id="main">
        <section className="hero section-pad" aria-labelledby="hero-title">
          <div className="hero-grid">
            <div className="hero-type">
              <h1 id="hero-title" tabIndex={-1} className="display">
                <span className="hero-line">
                  <span>СВОЇ.</span>
                </span>
                <span className="hero-line">
                  <span>МУЗИКА.</span>
                </span>
                <span className="hero-line red">
                  <span>{event.name.toUpperCase()}.</span>
                </span>
              </h1>
              <p className="hero-description">
                {event.name} збирає своїх на день народження.
                <br />І ти — його найважливіша частина.
              </p>
              <a className="button button-dark hero-cta" href="#rsvp">
                Звісно, я буду <span>↗</span>
              </a>
            </div>
            <div className="hero-art">
              <figure className="hero-photo">
                <img
                  src="/images/cake.jpg"
                  alt="Вишнево-червоний святковий торт зі свічками на хромованій підставці"
                  width="1024"
                  height="1280"
                  fetchPriority="high"
                />
              </figure>
              <div className="guest-sticker">
                <Star />
                <span>
                  ТИ У<br />
                  СПИСКУ
                </span>
              </div>
            </div>
          </div>
          <div className="hero-bottom">
            <div className="hero-date">
              {shortDate}
              <span>
                {weekdayLabel.toUpperCase()}
                <br />
                {timeLabel} · {event.city.toUpperCase()}
              </span>
            </div>
            <span className="hero-bottom-note">
              Без тебе ця ніч
              <br />
              буде зовсім іншою.
            </span>
            <a href="#message" className="scroll-cue" aria-label="Читати запрошення">
              ↓
            </a>
          </div>
        </section>
        <div className="poster-ribbon" aria-hidden="true">
          <span>ТІЛЬКИ СВОЇ</span>
          <Star />
          <span>ТІЛЬКИ ЦЯ НІЧ</span>
          <Star />
          <span>ТІЛЬКИ ХОРОШІ СПОГАДИ</span>
          <Star />
        </div>
        <section id="message" className="personal section-pad">
          <div className="personal-aside">
            <Star className="personal-star" />
            <span className="personal-note">
              Привід — мій день.
              <br />
              Сенс — наші люди.
            </span>
          </div>
          <div className="message-copy">
            <h2>
              Є люди, з якими
              <br />
              будь-який вечір —<br />
              <span className="red">вже свято.</span>
            </h2>
            <p>{event.message}</p>
            <span className="signature">
              Твоя {event.name} <span aria-hidden="true">↗</span>
            </span>
          </div>
        </section>
        <Countdown />
        <Gallery />
        <section id="details" className="details section-pad">
          <div className="section-heading">
            <div>
              <h2 className="display">
                ДЕ. КОЛИ.
                <br />
                <span className="red">В ЧОМУ.</span>
              </h2>
            </div>
            <Star className="details-star" />
          </div>
          <div className="details-grid">
            <div className="detail-row">
              <span className="detail-label">Дата</span>
              <div>
                <h3>{dateLabel()}</h3>
                <p>
                  {weekdayLabel.charAt(0).toUpperCase() + weekdayLabel.slice(1)}. Вечір для нас.
                </p>
                <button className="text-link" onClick={downloadCalendar}>
                  Додати в календар <span>↗</span>
                </button>
              </div>
            </div>
            <div className="detail-row">
              <span className="detail-label">Час</span>
              <div>
                <h3>{timeLabel}</h3>
                <p>Приходь вчасно — перші обійми найтепліші.</p>
              </div>
            </div>
            <div className="detail-row">
              <span className="detail-label">Місце</span>
              <div>
                <h3>{event.city}</h3>
                <p>
                  {locationLabel}
                  {event.address ? ` · ${event.address}` : ''}
                </p>
                {routeUrl && (
                  <a className="text-link" href={routeUrl} target="_blank" rel="noreferrer">
                    Прокласти маршрут ↗
                  </a>
                )}
              </div>
            </div>
            <div className="detail-row">
              <span className="detail-label">Дрес-код</span>
              <div>
                <h3>{event.dressCode}</h3>
                <p>{event.dressNote}</p>
                <div
                  className="dress-swatches"
                  role="img"
                  aria-label="Кольори настрою: чорний, червоний, срібний"
                >
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="schedule section-pad">
          <div className="schedule-heading">
            <h2 className="display">
              НІЧ НАШИМИ
              <br />
              ОЧИМА.
            </h2>
            <p>
              Без суворого сценарію.
              <br />
              Але з кількома прекрасними приводами.
            </p>
            <Star className="schedule-star" />
          </div>
          <div className="timeline">
            {event.schedule.map((item) => (
              <div className="timeline-row" key={item.time}>
                <span className="timeline-time">{item.time}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <Ticket />
        <RSVP />
        <footer className="footer section-pad">
          <div className="footer-heading">
            <h2 className="display">
              ПОБАЧИМОСЬ.
              <br />
              <span className="red">ОБІЙМЕМОСЬ.</span>
            </h2>
            <a
              href="#rsvp"
              className="footer-arrow"
              aria-label="Перейти до відповіді на запрошення"
            >
              ↗
            </a>
          </div>
          <div className="footer-bottom">
            <span>
              З любов’ю, {event.name}. {shortDate}.{eventYear} · {event.city}
            </span>
            <button onClick={playOpening}>Повторити початок ↺</button>
            <a href="#main">Нагору ↑</a>
          </div>
        </footer>
      </main>
      {opening && <Opening onClose={closeOpening} />}
    </div>
  );
}
export default App;
