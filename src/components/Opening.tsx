import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { event, shortDate, eventYear } from '../config';
import { useMotionPreference } from '../hooks/useMotionPreference';

gsap.registerPlugin(useGSAP);
export function Opening({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const reduced = useMotionPreference();
  useEffect(() => {
    const el = dialog.current;
    el?.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      el?.close();
      document.body.style.overflow = old;
    };
  }, []);
  useGSAP(
    () => {
      if (reduced) return;
      timeline.current = gsap
        .timeline({ defaults: { ease: 'power3.out' }, onComplete: onClose })
        .from('.envelope', { y: 28, autoAlpha: 0, duration: 0.55 })
        .from('.opening-address', { y: 12, autoAlpha: 0, duration: 0.45 }, 0.2)
        .addLabel('unseal', 1.65)
        .to('.wax-seal', { scale: 1.12, rotation: -12, autoAlpha: 0, duration: 0.3 }, 'unseal')
        .to(
          '.envelope-flap',
          { rotationX: 175, duration: 0.65, ease: 'power2.inOut' },
          'unseal+=0.15',
        )
        .set('.envelope-flap', { zIndex: 0 }, 'unseal+=0.45')
        .to('.envelope-letter', { yPercent: -46, duration: 0.65 }, 'unseal+=0.5')
        .to(dialog.current, { opacity: 0, duration: 0.4 }, 'unseal+=1.12');
      return () => {
        timeline.current = null;
      };
    },
    { scope: dialog, dependencies: [reduced], revertOnUpdate: true },
  );
  const close = () => {
    timeline.current?.kill();
    onClose();
  };
  const open = () => {
    if (reduced || !timeline.current) {
      close();
      return;
    }
    if (timeline.current.time() < timeline.current.labels.unseal) timeline.current.play('unseal');
  };
  return (
    <dialog
      ref={dialog}
      className="opening"
      aria-label="Особисте запрошення"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <div className="opening-top">
        <button autoFocus onClick={close}>
          Пропустити
        </button>
      </div>
      <div className="opening-scene">
        <div className="envelope">
          <div className="envelope-letter" aria-hidden="true">
            <span>
              ТИ У<br />
              СПИСКУ.
            </span>
            <span>{event.name} запрошує</span>
          </div>
          <div className="envelope-pocket" aria-hidden="true" />
          <div className="envelope-flap" aria-hidden="true" />
          <div className="seal-position">
            <button className="wax-seal" onClick={open} aria-label="Відкрити конверт">
              <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">
                <defs>
                  <linearGradient id="wax-edge" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#eb6870" />
                    <stop offset="0.25" stopColor="#a51f28" />
                    <stop offset="0.5" stopColor="#73151d" />
                    <stop offset="0.72" stopColor="#ce414b" />
                    <stop offset="1" stopColor="#5f1018" />
                  </linearGradient>
                  <radialGradient id="wax-face" cx="35%" cy="23%" r="80%">
                    <stop stopColor="#d64650" />
                    <stop offset="0.6" stopColor="#ac222d" />
                    <stop offset="1" stopColor="#70141e" />
                  </radialGradient>
                  <linearGradient id="wax-ring" x1="0" y1="0" x2="0.7" y2="1">
                    <stop stopColor="#f3999c" />
                    <stop offset="0.28" stopColor="#65121b" />
                    <stop offset="0.58" stopColor="#c7414b" />
                    <stop offset="0.8" stopColor="#ee868d" />
                    <stop offset="1" stopColor="#70121c" />
                  </linearGradient>
                </defs>
                <path
                  d="M100 9C120 6 130 20 145 23C166 27 170 42 178 59C187 73 193 89 188 107C187 127 178 135 171 153C164 170 148 173 131 181C113 190 99 187 82 189C62 190 49 179 35 167C20 154 18 141 13 124C7 108 10 89 16 74C21 57 30 47 42 33C56 17 78 14 100 9Z"
                  fill="url(#wax-edge)"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="69"
                  fill="url(#wax-face)"
                  stroke="#68121a"
                  strokeWidth="5"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="68"
                  fill="none"
                  stroke="url(#wax-ring)"
                  strokeWidth="3.5"
                />
                <circle cx="100" cy="100" r="59" fill="none" stroke="#70151d" strokeWidth="1.5" />
                <path
                  d="M30 81C34 49 61 24 88 22M117 178C146 174 169 153 177 126"
                  fill="none"
                  stroke="#f39ba0"
                  strokeOpacity="0.55"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <g fill="none" strokeWidth="16">
                  <path
                    d="M113 85a25 25 0 1 0 0 34"
                    stroke="#e1656e"
                    transform="translate(0 1.5)"
                  />
                  <path d="M113 85a25 25 0 1 0 0 34" stroke="#75131e" />
                </g>
                <circle cx="128" cy="122" r="8" fill="#e1656e" />
                <circle cx="128" cy="120.5" r="8" fill="#75131e" />
              </svg>
            </button>
          </div>
        </div>
        <div className="opening-address">
          <p className="opening-name">Для своїх.</p>
          <p>
            {event.name} запрошує · {shortDate}.{eventYear}
          </p>
        </div>
      </div>
      <button className="opening-enter" onClick={open}>
        Відкрити запрошення
      </button>
    </dialog>
  );
}
