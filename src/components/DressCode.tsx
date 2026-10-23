import { useState } from 'react';
import type { CSSProperties } from 'react';
import { event } from '../config';

export function DressCode() {
  const [selected, setSelected] = useState<string | null>(null);
  const look = event.dressColors.find((color) => color.id === selected);
  return (
    <div
      className="detail-row dress-code"
      style={{ '--look-color': look?.hex || '#c9c8c2' } as CSSProperties}
    >
      <span className="detail-label">Дрес-код</span>
      <div className="dress-content">
        <div className="dress-heading">
          <div>
            <h3>{event.dressCode}</h3>
            <p>{event.dressNote}</p>
            <p className="dress-instruction" id="dress-instruction">
              Натисни на колір — приміряй настрій.
            </p>
          </div>
          <div className="disco-scene" aria-hidden="true">
            <div className="disco-halo" />
            <svg
              key={selected || 'initial'}
              className={`disco-ball ${look ? 'is-lit' : ''}`}
              viewBox="0 0 180 210"
              fill="none"
            >
              <defs>
                <radialGradient id="mirror-sphere" cx="30%" cy="25%" r="80%">
                  <stop stopColor="#fff" />
                  <stop offset="0.45" stopColor="#deded8" />
                  <stop offset="0.8" stopColor="#686762" />
                  <stop offset="1" stopColor="#191917" />
                </radialGradient>
                <clipPath id="mirror-circle">
                  <circle cx="90" cy="122" r="66" />
                </clipPath>
              </defs>
              <path d="M90 0v56" stroke="#686762" strokeWidth="1" />
              <circle cx="90" cy="122" r="66" fill="url(#mirror-sphere)" />
              <g clipPath="url(#mirror-circle)">
                {Array.from({ length: 12 }, (_, row) =>
                  Array.from({ length: 12 }, (_, col) => (
                    <rect
                      key={`${row}-${col}`}
                      x={24 + col * 11 + (row % 2 ? -5 : 0)}
                      y={56 + row * 11}
                      width="9.5"
                      height="9.5"
                      fill={
                        ['#fff', '#191917', '#c9c8c2', '#faf9f6', '#686762'][
                          (row * 7 + col * 3) % 5
                        ]
                      }
                      opacity={0.16 + ((row + col * 3) % 4) * 0.16}
                    />
                  )),
                )}
                <ellipse cx="90" cy="122" rx="38" ry="66" stroke="#f1efe9" strokeOpacity="0.5" />
                <ellipse cx="90" cy="122" rx="57" ry="66" stroke="#191917" strokeOpacity="0.2" />
                <circle
                  cx="90"
                  cy="122"
                  r="66"
                  fill="var(--look-color)"
                  opacity={look ? '0.28' : '0'}
                />
              </g>
              <path d="M48 80v23M36 92h24M128 148v19M118 158h20" stroke="white" strokeWidth="2" />
              <path
                className="disco-spark"
                d="M150 62v22M139 73h22M18 143v15M10 151h16"
                stroke="var(--look-color)"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
        <div
          className="dress-palette"
          role="group"
          aria-label="Кольори дрес-коду"
          aria-describedby="dress-instruction"
        >
          {event.dressColors.map((color) => (
            <button
              key={color.id}
              type="button"
              className={`color-card color-${color.id}`}
              aria-pressed={selected === color.id}
              onClick={() => setSelected(color.id)}
              style={{ '--swatch': color.hex } as CSSProperties}
            >
              <span className="color-chip" aria-hidden="true" />
              <span className="color-name">{color.name}</span>
            </button>
          ))}
        </div>
        <div className="dress-response" role="status" aria-live="polite" aria-atomic="true">
          {look ? (
            <p key={look.id}>
              <strong>{look.name}.</strong> {look.tip}
            </p>
          ) : (
            <p>Один відтінок або кілька разом. Головне — щоб у цьому образі було добре тобі.</p>
          )}
        </div>
      </div>
    </div>
  );
}
