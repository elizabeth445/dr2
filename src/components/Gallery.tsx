import { useEffect, useRef, useState } from 'react';
import { event } from '../config';
import { Arrow } from './Arrow';
export function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const isOpen = selected !== null;
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const el = dialog.current;
    el?.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      el?.close();
      document.body.style.overflow = old;
      previous?.focus({ preventScroll: true });
    };
  }, [isOpen]);
  return (
    <section id="mood" className="mood section-pad">
      <div className="section-heading">
        <div>
          <h2 className="display">
            ТРОХИ БЛИСКУ.
            <br />
            <span className="red">БАГАТО НАС.</span>
          </h2>
        </div>
        <p>
          Не ідеальні кадри.
          <br />
          Ідеальні спогади.
        </p>
      </div>
      <div className="photo-strip" aria-label="Фото настрою. Гортай, щоб побачити всі.">
        {event.photos.map((photo, index) => (
          <button
            className={`photo-card photo-${index}`}
            key={photo.title}
            onClick={() => setSelected(index)}
            title={`Відкрити фото: ${photo.title}`}
          >
            <span className="photo-image">
              <img
                src={photo.src}
                alt=""
                style={{ objectPosition: photo.position }}
                loading="lazy"
                width="800"
                height="1000"
              />
            </span>
            <span className="photo-caption">
              <span>{photo.title}</span>
            </span>
          </button>
        ))}
      </div>
      {selected !== null && (
        <dialog
          ref={dialog}
          className="lightbox"
          onCancel={(e) => {
            e.preventDefault();
            setSelected(null);
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
          aria-label={event.photos[selected].title}
        >
          <button
            className="dialog-close"
            autoFocus
            onClick={() => setSelected(null)}
            aria-label="Закрити фото"
          >
            ×
          </button>
          <img src={event.photos[selected].src} alt={event.photos[selected].title} />
          <div className="lightbox-caption">
            <div>
              <h3>{event.photos[selected].title}</h3>
              <p>{event.photos[selected].caption}</p>
            </div>
            <div className="lightbox-controls">
              <button
                onClick={() =>
                  setSelected((selected + event.photos.length - 1) % event.photos.length)
                }
                aria-label="Попереднє фото"
              >
                <Arrow direction="left" />
              </button>
              <button
                onClick={() => setSelected((selected + 1) % event.photos.length)}
                aria-label="Наступне фото"
              >
                <Arrow direction="right" />
              </button>
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
}
