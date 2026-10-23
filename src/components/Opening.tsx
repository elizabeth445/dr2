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
        .from('.opening-pass', { y: 90, rotation: -8, scale: 0.94, duration: 0.65 })
        .from('.opening-word', { yPercent: 110, stagger: 0.12, duration: 0.5 }, 0.2)
        .to('.opening-pass', { rotation: 3, duration: 0.35 }, 1.25)
        .to(dialog.current, { opacity: 0, duration: 0.3 }, 1.65);
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
          Пропустити ↗
        </button>
      </div>
      <div className="opening-pass">
        <div className="opening-line">
          <span className="opening-word">ТИ.</span>
        </div>
        <div className="opening-line">
          <span className="opening-word">У СПИСКУ.</span>
        </div>
        <div className="pass-line">
          <span>
            {event.name} запрошує
            <br />
            {shortDate}.{eventYear}
          </span>
          <span>✳</span>
        </div>
      </div>
      <button className="opening-enter" onClick={close}>
        Відкрити запрошення <span>↗</span>
      </button>
    </dialog>
  );
}
