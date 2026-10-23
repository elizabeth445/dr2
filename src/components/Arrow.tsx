export function Arrow({ direction }: { direction: 'up' | 'down' | 'left' | 'right' }) {
  const paths = {
    up: 'M12 20V4M5 11l7-7 7 7',
    down: 'M12 4v16M5 13l7 7 7-7',
    left: 'M20 12H4M11 5l-7 7 7 7',
    right: 'M4 12h16M13 5l7 7-7 7',
  };
  return (
    <svg
      className="arrow-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[direction]} stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}
