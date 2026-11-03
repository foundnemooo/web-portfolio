import type { ReactNode, SVGProps } from 'react';

export type RetroIconName =
  | 'award'
  | 'briefcase'
  | 'chevron-right'
  | 'close'
  | 'external-link'
  | 'file'
  | 'folder'
  | 'folder-open'
  | 'github'
  | 'graduation-cap'
  | 'hard-drive'
  | 'linkedin'
  | 'mail'
  | 'map-pin'
  | 'maximize'
  | 'minimize'
  | 'monitor'
  | 'power'
  | 'restart'
  | 'user';

type RetroIconProps = Omit<SVGProps<SVGSVGElement>, 'name' | 'width' | 'height'> & {
  name: RetroIconName;
  size?: number;
};

export function RetroIcon({ name, size = 18, className, ...props }: RetroIconProps) {
  const base = {
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'square' as const,
    strokeLinejoin: 'miter' as const,
  };

  let glyph: ReactNode = null;
  switch (name) {
    case 'award':
      glyph = (
        <>
          <path d="m8 13-2 8 4-1.7 2 2 2-7.7M16 13l2 8-4-1.7-2 2" fill="#df6048" stroke="#8d3527" strokeWidth="1" />
          <path d="m12 2 2.1 1.4 2.5-.1 1.1 2.2 2.1 1.4-.5 2.5.5 2.4-2.1 1.5-1.1 2.1-2.5-.1L12 16l-2.1-1.2-2.5.1-1.1-2.1-2.1-1.5.5-2.4-.5-2.5 2.1-1.4 1.1-2.2 2.5.1z" fill="#ffd44f" stroke="#8d641b" strokeWidth="1.2" />
          <path d="m12 5 1.1 2.1 2.4.3-1.7 1.7.4 2.4-2.2-1.1-2.2 1.1.4-2.4-1.7-1.7 2.4-.3z" fill="#fff2b3" stroke="#b48428" strokeWidth=".8" />
        </>
      );
      break;
    case 'briefcase':
      glyph = (
        <>
          <path d="M8 6V4h8v2" fill="none" {...base} />
          <path d="M3 8h18v11H3z" fill="#4b91c8" stroke="#174d7d" strokeWidth="1.3" />
          <path d="M3 11h18v3H3z" fill="#91c5e8" stroke="#174d7d" strokeWidth="1" />
          <path d="M10 11h4v3h-4z" fill="#f7d65b" stroke="#8c6a1d" strokeWidth=".8" />
        </>
      );
      break;
    case 'chevron-right':
      glyph = <path d="m8 5 7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />;
      break;
    case 'close':
      glyph = <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="square" />;
      break;
    case 'external-link':
      glyph = (
        <>
          <path d="M13 4h7v7M20 4l-9 9" fill="none" {...base} />
          <path d="M18 13v6H4V5h7" fill="none" {...base} />
        </>
      );
      break;
    case 'file':
      glyph = (
        <>
          <path d="M5 2.5h9l5 5V21H5z" fill="#fffef6" stroke="#6284a1" strokeWidth="1.2" />
          <path d="M14 2.5v5h5" fill="#b9d8f0" stroke="#6284a1" strokeWidth="1.1" />
          <path d="M8 12h8M8 15h8M8 18h6" fill="none" stroke="#4d89bd" strokeWidth="1.3" />
        </>
      );
      break;
    case 'folder':
      glyph = (
        <>
          <path d="M2.5 6h7l2 2H21v12H2.5z" fill="#e9b937" stroke="#805c1d" strokeWidth="1.2" />
          <path d="M3 10h18v10H3z" fill="#ffe58a" stroke="#a97b20" strokeWidth="1" />
          <path d="M4 11h16" fill="none" stroke="#fff3c5" strokeWidth="1.4" />
        </>
      );
      break;
    case 'folder-open':
      glyph = (
        <>
          <path d="M2 6h7l2 2h10v5H7z" fill="#edc347" stroke="#805c1d" strokeWidth="1.1" />
          <path d="M2.5 11.5h19l-3 8H2z" fill="#ffe58a" stroke="#a97b20" strokeWidth="1.1" />
          <path d="M4 12.5h15" fill="none" stroke="#fff7d9" strokeWidth="1.2" />
        </>
      );
      break;
    case 'github':
      glyph = (
        <>
          <path d="M5 8 7 5h3l2 2 2-2h3l2 3 2 2v7l-3 3h-4v-3h-4v3H7l-3-3v-7z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
          <path d="M8 10h2v2H8zm6 0h2v2h-2zM9 15h6" fill="#fff" stroke="#fff" strokeWidth="1" />
          <path d="M10 18v2m4-2v2" fill="none" stroke="currentColor" strokeWidth="2" />
        </>
      );
      break;
    case 'graduation-cap':
      glyph = (
        <>
          <path d="m2 9 10-5 10 5-10 5z" fill="#347db9" stroke="#164f82" strokeWidth="1.2" />
          <path d="M6 11v5c3.7 3 8.3 3 12 0v-5l-6 3z" fill="#78b5de" stroke="#164f82" strokeWidth="1.1" />
          <path d="M21 10v6" fill="none" stroke="#d9aa32" strokeWidth="1.4" />
          <path d="M20 16h2v2h-2z" fill="#ffd44f" stroke="#8d641b" strokeWidth=".8" />
        </>
      );
      break;
    case 'hard-drive':
      glyph = (
        <>
          <path d="M4 4h16v5H4zM4 10h16v5H4zM4 16h16v5H4z" fill="#d9e0e5" stroke="#647684" strokeWidth="1.1" />
          <path d="M7 6.5h7M7 12.5h7M7 18.5h7" fill="none" stroke="#93a4b0" strokeWidth="1" />
          <path d="M17 6h1v1h-1zM17 12h1v1h-1zM17 18h1v1h-1z" fill="#63b541" stroke="#3c7d27" strokeWidth=".7" />
        </>
      );
      break;
    case 'linkedin':
      glyph = (
        <>
          <path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1" fill="#2477a9" stroke="#135576" strokeWidth="1.1" />
          <text x="5.1" y="17.4" fill="#fff" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="700" letterSpacing="-.7">in</text>
        </>
      );
      break;
    case 'mail':
      glyph = (
        <>
          <path d="M3 6h18v13H3z" fill="#fdfdf9" stroke="#4a7597" strokeWidth="1.2" />
          <path d="m4 7 8 7 8-7" fill="none" stroke="#d64e3b" strokeWidth="1.7" />
          <path d="M4 18l6-5m10 5-6-5" fill="none" stroke="#4a7597" strokeWidth="1" />
        </>
      );
      break;
    case 'map-pin':
      glyph = (
        <>
          <path d="M12 22s-7-7.2-7-13a7 7 0 1 1 14 0c0 5.8-7 13-7 13" fill="#d84a36" stroke="#92372c" strokeWidth="1.2" />
          <circle cx="12" cy="9" r="2.4" fill="#ffe8a2" stroke="#92372c" strokeWidth="1" />
        </>
      );
      break;
    case 'maximize':
      glyph = <path d="M5 5h14v14H5z" fill="none" stroke="currentColor" strokeWidth="2" />;
      break;
    case 'minimize':
      glyph = <path d="M5 17h14" fill="none" stroke="currentColor" strokeWidth="2.6" />;
      break;
    case 'monitor':
      glyph = (
        <>
          <path d="M2.5 3h19v14h-19z" fill="#28669d" stroke="#173e60" strokeWidth="1.2" />
          <path d="M5 5.5h14v9H5z" fill="#74c8e8" stroke="#c4f2ff" strokeWidth=".7" />
          <path d="M5 12h14v2.5H5z" fill="#54ad42" stroke="#39862d" strokeWidth=".7" />
          <path d="M10 17v3m4-3v3m-7 1h14" fill="none" stroke="#566d7d" strokeWidth="1.5" />
        </>
      );
      break;
    case 'power':
      glyph = (
        <>
          <path d="M12 3v7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M7 6.5a7.5 7.5 0 1 0 10 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
      );
      break;
    case 'restart':
      glyph = (
        <>
          <path d="M19 8a8 8 0 1 0 1 6" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M16 3h5v5" fill="none" stroke="currentColor" strokeWidth="2" />
        </>
      );
      break;
    case 'user':
      glyph = (
        <>
          <path d="M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8" fill="#f4c99b" stroke="#8f6041" strokeWidth="1.1" />
          <path d="M4 21v-2.5c0-3.6 3.3-5.5 8-5.5s8 1.9 8 5.5V21z" fill="#4c91c5" stroke="#1e5680" strokeWidth="1.2" />
          <path d="M9 14h6" stroke="#dcecf7" strokeWidth="1" />
        </>
      );
      break;
  }

  return (
    <svg
      className={className ? `xp-retro-glyph ${className}` : 'xp-retro-glyph'}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {glyph}
    </svg>
  );
}
