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
    el?.focus({ preventScroll: true });
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
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.envelope', { y: 28, autoAlpha: 0, duration: 0.55 })
        .from('.opening-address', { y: 12, autoAlpha: 0, duration: 0.45 }, 0.2);
      timeline.current = gsap
        .timeline({ paused: true, defaults: { ease: 'power3.out' }, onComplete: onClose })
        .addLabel('unseal', 0)
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
    timeline.current.play();
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
        <button onClick={close}>Пропустити</button>
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
          <div className="envelope-flap" aria-hidden="true">
            <div className="envelope-flap-paper" />
          </div>
          <div className="seal-position">
            <button className="wax-seal" onClick={open} aria-label="Відкрити конверт">
              <img
                src="/images/wax-seal-burgundy.webp"
                alt=""
                width="512"
                height="512"
                fetchPriority="high"
              />
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
