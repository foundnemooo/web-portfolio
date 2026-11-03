import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { RetroIcon, type RetroIconName } from './RetroIcon';
import './styles.css';

type AppId = 'about' | 'projects' | 'certificates' | 'contact';
type WindowState = { open: boolean; minimized: boolean; maximized: boolean; z: number; x: number; y: number };

const APP_IDS: AppId[] = ['about', 'projects', 'certificates', 'contact'];
const WINDOW_EXIT_MS = 420;
const WINDOW_MINIMIZE_MS = 360;
const WINDOW_RESTORE_MS = 300;
const START_MENU_EXIT_MS = 240;
const WINDOW_META: Record<AppId, { title: string; width: number; height: number; Icon: RetroIconName }> = {
  about: { title: 'About Me', width: 760, height: 570, Icon: 'user' },
  projects: { title: 'My Projects', width: 900, height: 620, Icon: 'folder-open' },
  certificates: { title: 'Certificates', width: 800, height: 590, Icon: 'award' },
  contact: { title: 'Contact Joshua', width: 720, height: 510, Icon: 'mail' },
};

let startupAudioContext: AudioContext | null = null;

function playStartupSound() {
  const AudioContextConstructor = window.AudioContext
    || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextConstructor) return;

  startupAudioContext ??= new AudioContextConstructor();
  const context = startupAudioContext;
  const play = () => {
    const start = context.currentTime;
    const notes = [
      { offset: 0, frequency: 261.63, duration: 0.58, volume: 0.045 },
      { offset: 0.08, frequency: 329.63, duration: 0.58, volume: 0.035 },
      { offset: 0.16, frequency: 392, duration: 0.68, volume: 0.03 },
      { offset: 0.3, frequency: 523.25, duration: 0.8, volume: 0.018 },
    ];

    notes.forEach(({ offset, frequency, duration, volume }) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, start + offset);
      gain.gain.setValueAtTime(0.0001, start + offset);
      gain.gain.exponentialRampToValueAtTime(volume, start + offset + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start + offset);
      oscillator.stop(start + offset + duration + 0.03);
    });
  };

  if (context.state === 'suspended') {
    void context.resume().then(play).catch(() => undefined);
  } else {
    play();
  }
}

const ASSETS = {
  portrait: '/assets/headshot.png',
  wallpaper: '/assets/xp-bliss-hd.jpg',
  resume: '/assets/Joshua_Ceazar_Lopez_Resume.pdf',
};

const imagePreloadCache = new Map<string, Promise<void>>();

function preloadImage(src: string) {
  const cached = imagePreloadCache.get(src);
  if (cached) return cached;

  const image = new window.Image();
  image.decoding = 'async';
  const promise = new Promise<void>((resolve) => {
    const finish = () => resolve();
    image.addEventListener('load', finish, { once: true });
    image.addEventListener('error', finish, { once: true });
    image.src = src;
    if (image.complete) finish();
  });
  imagePreloadCache.set(src, promise);
  return promise;
}

type RecentAppId = 'vscode' | 'codex' | 'spotify' | 'github' | 'chrome' | 'edge' | 'firefox';
type RecentApp = { id: RecentAppId; label: string; detail: string };

const RECENT_APPS: RecentApp[] = [
  { id: 'vscode', label: 'VS Code', detail: 'Editor' },
  { id: 'codex', label: 'Codex', detail: 'AI coding' },
  { id: 'spotify', label: 'Spotify', detail: 'Focus music' },
  { id: 'github', label: 'GitHub', detail: 'Repositories' },
  { id: 'chrome', label: 'Chrome', detail: 'Browser' },
  { id: 'edge', label: 'Edge', detail: 'Browser' },
  { id: 'firefox', label: 'Firefox', detail: 'Browser' },
];

type ProjectScreenshot = { src: string; label: string; alt: string };
type ProjectTechGroup = { title: string; kicker: string; items: { name: string; detail: string }[] };
type Project = {
  id: string;
  title: string;
  kind: string;
  year: string;
  image?: string;
  description: string;
  technologies: string[];
  screenshots: ProjectScreenshot[];
  stackGroups?: ProjectTechGroup[];
  techNote?: { label: string; detail: string };
};

const projects: Project[] = [
  {
    id: 'ceazar-xp',
    title: 'This Web Portfolio',
    kind: 'Personal website · Portfolio',
    year: '2026',
    description: 'A Windows XP-inspired interactive web portfolio, with a custom boot sequence, animated wallpaper, draggable app windows, and portfolio folders.',
    technologies: ['React 18', 'TypeScript', 'Vite', 'CSS3'],
    screenshots: [],
    stackGroups: [
      { title: 'Core technology', kicker: 'APPLICATION STACK', items: [
        { name: 'React 18.3.1', detail: 'Component-based interface and interactive desktop/window state.' },
        { name: 'TypeScript 5.7', detail: 'Typed React components, project records and navigation.' },
        { name: 'Vite 6', detail: 'Development server, fast refresh and production build.' },
      ] },
      { title: 'Desktop behavior', kicker: 'WINDOW SYSTEM', items: [
        { name: 'React state model', detail: 'Coordinates desktop windows, Start menu, taskbar and project navigation.' },
        { name: 'Pointer events', detail: 'Support window dragging and interactive desktop controls.' },
      ] },
      { title: 'Animation & interaction', kicker: 'MOTION SYSTEM', items: [
        { name: 'Custom CSS keyframes and transitions', detail: 'Boot, window, wallpaper, cursor-trail and hover animations; no separate motion library.' },
      ] },
      { title: 'Styling & typography', kicker: 'VISUAL SYSTEM', items: [
        { name: 'Custom CSS3', detail: 'XP-inspired chrome, gradients, responsive layouts and reduced-motion rules.' },
        { name: 'DM Sans · DM Mono · Playfair Display', detail: 'Interface, technical labels and display typography.' },
      ] },
    ],
    techNote: { label: 'Motion & styling', detail: 'Custom CSS keyframes and transitions, with responsive rules for the animated desktop and windowed apps.' },
  },
  {
    id: 'noti-fire',
    title: 'NotiFire',
    kind: 'Mobile app / Capstone',
    year: '2024',
    image: '/assets/notifire.jpg',
    description: 'An IoT-based fire detection system that connects ESP32 hardware to Firebase Realtime Database and delivers real-time push notifications through Firebase Cloud Messaging.',
    technologies: ['Flutter 3.27', 'Dart', 'Firebase', 'Cloud Functions', 'FCM'],
    screenshots: [
      { src: '/assets/gallery-crops/noti-fire/1.png', label: 'Home dashboard', alt: 'NotiFire home dashboard' },
      { src: '/assets/gallery-crops/noti-fire/2.png', label: 'Reports', alt: 'NotiFire reports dashboard' },
      { src: '/assets/gallery-crops/noti-fire/3.png', label: 'Floor tabs', alt: 'NotiFire floor tabs' },
      { src: '/assets/gallery-crops/noti-fire/4.png', label: 'Room history', alt: 'NotiFire room history summary' },
      { src: '/assets/gallery-crops/noti-fire/5.png', label: 'Room overview', alt: 'NotiFire floor tabs alternate view' },
      { src: '/assets/gallery-crops/noti-fire/6.png', label: 'Room details', alt: 'NotiFire room details and alarm history' },
    ],
    stackGroups: [
      { title: 'Flutter application', kicker: 'MOBILE UI & STATE', items: [
        { name: 'Flutter 3.27 + Dart + Material 3', detail: 'Cross-platform mobile interface for the fire-monitoring experience.' },
        { name: 'Provider + ChangeNotifier', detail: 'Application state management across dashboard and alert flows.' },
      ] },
      { title: 'Firebase services', kicker: 'CLOUD DATA & MESSAGING', items: [
        { name: 'Firebase Authentication + Cloud Firestore', detail: 'User identity and cloud-backed application data.' },
        { name: 'Realtime Database + Cloud Storage', detail: 'Live fire/smoke sensor data and stored application assets.' },
        { name: 'Firebase Cloud Messaging', detail: 'Remote push delivery for time-sensitive fire and smoke alerts.' },
      ] },
      { title: 'Alert pipeline', kicker: 'REAL-TIME RESPONSE', items: [
        { name: 'Firebase Cloud Functions · Node.js 18', detail: 'JavaScript ES-module backend for server-side event handling.' },
        { name: 'Realtime Database onCreate triggers', detail: 'New fire/smoke records trigger Cloud Functions alert workflows.' },
        { name: 'Awesome Notifications 0.10 + Flutter Local Notifications 18.0.1', detail: 'Local alert delivery, including custom Android notification sounds.' },
      ] },
      { title: 'Platform & notable packages', kicker: 'DEVICE INTEGRATION', items: [
        { name: 'fl_chart + flutter_slidable + image_picker', detail: 'Charting, swipe actions and image capture flows.' },
        { name: 'Android · Kotlin · SDK 34 · Gradle 8.4', detail: 'Native Android runner and build toolchain.' },
        { name: 'iOS · Swift/Xcode runner', detail: 'Native iOS target within the Flutter project.' },
        { name: 'Poppins · SVG · floor plans · MP3/WAV', detail: 'Visual assets and custom alarm-audio resources.' },
      ] },
    ],
    techNote: { label: 'Alert delivery', detail: 'Realtime Database events feed Cloud Functions, with Firebase Cloud Messaging and local notifications delivering fire/smoke alerts.' },
  },
  {
    id: 'armi-vidas-mart',
    title: 'Armi Vida’s Mart',
    kind: 'Point of sale system',
    year: '2026',
    image: '/assets/armi.png',
    description: 'A full-stack POS application for faster checkout, organized inventory tracking, product management, sales processing, and transaction records.',
    technologies: ['React 19', 'TanStack Start', 'Supabase', 'Tailwind CSS 4', 'Offline-first PWA'],
    screenshots: [
      { src: '/assets/gallery-crops/armi-mart/1.png', label: 'Sign in', alt: 'Armi Vida’s Mart sign-in screen' },
      { src: '/assets/gallery-crops/armi-mart/2.png', label: 'Cashier', alt: 'Armi Vida’s Mart cashier screen' },
      { src: '/assets/gallery-crops/armi-mart/3.png', label: 'Inventory', alt: 'Armi Vida’s Mart inventory screen' },
      { src: '/assets/gallery-crops/armi-mart/4.png', label: 'Statistics', alt: 'Armi Vida’s Mart statistics screen' },
    ],
    stackGroups: [
      { title: 'Core application', kicker: 'FRAMEWORK & LANGUAGE', items: [
        { name: 'React 19 + TypeScript 5', detail: 'Typed React application for cashier, inventory, product and reporting workflows.' },
        { name: 'TanStack Start + TanStack Router', detail: 'Full-stack React framework with structured, type-safe routing.' },
        { name: 'Vite 7 + Nitro', detail: 'Modern frontend build tooling and server runtime integration.' },
      ] },
      { title: 'Supabase data layer', kicker: 'DATABASE & ACCESS', items: [
        { name: 'Supabase + @supabase/supabase-js', detail: 'PostgreSQL-backed POS data, Supabase Auth and product-image Storage.' },
        { name: 'Row-Level Security', detail: 'Database policies that enforce access boundaries for application data.' },
        { name: 'Storage + SQL migrations + generated types', detail: 'Product-image storage and versioned, typed database structure.' },
      ] },
      { title: 'POS interface & libraries', kicker: 'CHECKOUT & REPORTING', items: [
        { name: 'Tailwind CSS 4 + shadcn/ui + Radix', detail: 'Utility styling with composable accessible interface primitives.' },
        { name: 'html5-qrcode', detail: 'Camera-based barcode scanning for checkout.' },
        { name: 'React Hook Form + Zod', detail: 'Structured forms with schema-based validation.' },
        { name: 'Recharts + date-fns', detail: 'Sales visualization and date/reporting calculations.' },
        { name: 'Lucide React + Sonner', detail: 'Project icon library and toast notifications.' },
      ] },
      { title: 'Offline-first PWA', kicker: 'LOCAL DATA & RESILIENCE', items: [
        { name: 'vite-plugin-pwa + Service Worker/Workbox', detail: 'Supabase Storage uses CacheFirst; REST requests use NetworkFirst with a four-second network timeout.' },
        { name: 'idb-keyval + IndexedDB', detail: 'Product data and active day sessions are cached locally; completed offline sales persist in a queue.' },
        { name: 'useOnlineStatus + useSyncQueue', detail: 'On reconnect, queued sales, sale items and stock changes sync to Supabase; a lock prevents duplicate runs.' },
      ] },
    ],
    techNote: { label: 'Offline sales architecture', detail: 'Successful queue entries are removed, failed syncs stay tracked with Sonner notices, and live statistics remain unavailable offline.' },
  },
  {
    id: 'tdip',
    title: 'TDIP',
    kind: 'Web app / Operations',
    year: '2026',
    image: '/assets/tdip.png',
    description: 'A centralized portal that streamlines TESDA regional office operations across CACS, Finance, Scholarship, UTPRAS, and Administration through role-based workflows.',
    technologies: ['React 19', 'TanStack Start', 'Supabase', 'Tailwind CSS v4', 'Edge Functions'],
    screenshots: [
      { src: '/assets/gallery-crops/tdip/1.png', label: 'Sign in', alt: 'TDIP sign-in screen' },
      { src: '/assets/gallery-crops/tdip/2.png', label: 'Dashboard', alt: 'TDIP dashboard' },
      { src: '/assets/gallery-crops/tdip/3.png', label: 'CACS sections', alt: 'TDIP CACS sections' },
      { src: '/assets/gallery-crops/tdip/4.png', label: 'Assessment schedule', alt: 'TDIP assessment schedule' },
      { src: '/assets/gallery-crops/tdip/5.png', label: 'UTPRAS monitoring', alt: 'TDIP UTPRAS monitoring' },
      { src: '/assets/gallery-crops/tdip/6.png', label: 'Training monitoring', alt: 'TDIP scholarship training monitoring' },
    ],
    stackGroups: [
      { title: 'Application framework', kicker: 'CORE APPLICATION', items: [
        { name: 'React 19 + TypeScript 5.8', detail: 'A typed component stack for a large, multi-module operations portal.' },
        { name: 'TanStack Start + TanStack Router', detail: 'Full-stack React framework and type-safe application routing.' },
        { name: 'Vite 7 + Nitro', detail: 'Modern build tooling with integrated server and build-runtime support.' },
      ] },
      { title: 'Supabase platform', kicker: 'BACKEND & DATA', items: [
        { name: 'PostgreSQL + Row Level Security', detail: 'Relational data with policy-enforced access control.' },
        { name: 'Auth + Storage + Realtime', detail: 'Managed identity, file storage and live data subscriptions.' },
        { name: 'RPCs + Edge Functions + Vault', detail: 'Database workflows, serverless logic and managed secrets.' },
        { name: 'pg_cron + pg_net', detail: 'Scheduled jobs and database-triggered HTTP requests.' },
      ] },
      { title: 'Interface & analytics', kicker: 'UI, FORMS & CHARTS', items: [
        { name: 'Tailwind CSS v4 + shadcn/ui + Radix', detail: 'Utility styling with accessible, composable UI primitives.' },
        { name: 'Lucide React', detail: 'Consistent SVG iconography across the application.' },
        { name: 'React Hook Form + Zod', detail: 'Form state with schema-based validation.' },
        { name: 'Recharts', detail: 'Data visualizations for dashboards and operational reporting.' },
      ] },
      { title: 'Documents & automation', kicker: 'FILES & COMMUNICATION', items: [
        { name: 'xlsx', detail: 'Excel import and export for operational data.' },
        { name: 'PDF.js + pdf-lib', detail: 'PDF rendering and programmatic document operations.' },
        { name: 'Mammoth + Docxtemplater', detail: 'DOCX reading and template-driven document generation.' },
        { name: 'Nodemailer + SMTP/Gmail', detail: 'Email delivery connected to Supabase Edge Function automations.' },
      ] },
    ],
    techNote: { label: 'Application scope', detail: 'Authentication, admin and audit logs, CACS, Finance, Scholarship, UTPRAS, Leave and Overtime.' },
  },
];

function warmProjectImages(project: Project) {
  if (project.image) void preloadImage(project.image);
  project.screenshots.forEach(({ src }) => void preloadImage(src));
}

const certificates = [
  { title: 'Introduction to Front-End Development', provider: 'Coursera', file: '/assets/intro-front-end.pdf', type: 'PDF' },
  { title: 'HTML and CSS In Depth', provider: 'Coursera', file: '/assets/html-css.pdf', type: 'PDF' },
  { title: 'Programming with JavaScript', provider: 'Coursera', file: '/assets/javascript.pdf', type: 'PDF' },
  { title: 'Version Control', provider: 'Coursera', file: '/assets/version-control.pdf', type: 'PDF' },
  { title: 'React Basics', provider: 'Coursera', file: '/assets/react-basics.pdf', type: 'PDF' },
  { title: 'Advanced React', provider: 'Coursera', file: '/assets/advanced-react.pdf', type: 'PDF' },
  { title: 'Web Content Management Using WordPress', provider: 'Certificate', file: '/assets/certificate-wordpress.jpg', type: 'JPG' },
];

const emptyWindow = (): WindowState => ({ open: false, minimized: false, maximized: false, z: 1, x: 30, y: 30 });
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

function CeazarMark({ small = false }: { small?: boolean }) {
  return (
    <span className={`ceazar-mark${small ? ' ceazar-mark-small' : ''}`} aria-hidden="true">
      <b>J</b><i>C</i><span className="mark-pixel" />
    </span>
  );
}

function DesktopCursorTrail() {
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = trailRef.current;
    const desktop = layer?.parentElement;
    if (!layer || !desktop || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cursors = Array.from(layer.querySelectorAll<HTMLElement>('.pixel-cursor'));
    const positions = cursors.map(() => ({ x: 0, y: 0 }));
    const pointer = { x: 0, y: 0, active: false };
    let frame = 0;

    const animate = () => {
      if (!pointer.active) {
        frame = 0;
        return;
      }

      let stillMoving = false;
      positions.forEach((position, index) => {
        const targetX = pointer.x - index * 5;
        const targetY = pointer.y + index * 5;
        const deltaX = targetX - position.x;
        const deltaY = targetY - position.y;
        if (index === 0) {
          position.x = pointer.x;
          position.y = pointer.y;
        } else {
          if (Math.abs(deltaX) > 0.1 || Math.abs(deltaY) > 0.1) stillMoving = true;
          position.x += deltaX * 0.72;
          position.y += deltaY * 0.72;
        }
        cursors[index].style.transform = `translate3d(${position.x - 2}px, ${position.y - 2}px, 0) scale(${1 - index * 0.1})`;
      });

      frame = stillMoving ? window.requestAnimationFrame(animate) : 0;
    };

    const hideTrail = () => {
      pointer.active = false;
      layer.classList.remove('cursor-trail-active');
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        hideTrail();
        return;
      }

      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!pointer.active) {
        pointer.active = true;
        positions.forEach((position, index) => {
          position.x = event.clientX - index * 5;
          position.y = event.clientY + index * 5;
        });
        layer.classList.add('cursor-trail-active');
      }
      if (!frame) frame = window.requestAnimationFrame(animate);
    };

    desktop.addEventListener('pointermove', onPointerMove, { passive: true });
    desktop.addEventListener('pointerleave', hideTrail);
    desktop.addEventListener('pointercancel', hideTrail);
    return () => {
      desktop.removeEventListener('pointermove', onPointerMove);
      desktop.removeEventListener('pointerleave', hideTrail);
      desktop.removeEventListener('pointercancel', hideTrail);
      hideTrail();
    };
  }, []);

  return <div ref={trailRef} className="cursor-trail-layer" aria-hidden="true">{[0, 1, 2, 3].map((index) => <span className={`pixel-cursor pixel-cursor-${index + 1}`} key={index}><i /></span>)}</div>;
}

function AppBrandIcon({ app, size = 28 }: { app: RecentAppId; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true, focusable: false } as const;
  switch (app) {
    case 'vscode':
      return <span className={`brand-app-icon brand-app-${app}`}><svg {...common}><path d="m4 7.4 5.1 4.6L4 16.6 5.9 19 13 13V11L5.9 5z" fill="currentColor" /><path d="m13 5.2 6.9-2.3v18.2L13 18.8z" fill="currentColor" opacity=".72" /><path d="m13 5.2 3.1 1.1v11.4L13 18.8z" fill="#fff" opacity=".22" /></svg></span>;
    case 'codex':
      return <span className={`brand-app-icon brand-app-${app}`}><svg {...common}><path d="M12 3.2a8.8 8.8 0 1 0 8.8 8.8A8.8 8.8 0 0 0 12 3.2Zm0 3a5.8 5.8 0 1 1-5.8 5.8A5.8 5.8 0 0 1 12 6.2Z" fill="currentColor" /><path d="M12 8.2a3.8 3.8 0 1 1-3.8 3.8A3.8 3.8 0 0 1 12 8.2Zm0 2.1a1.7 1.7 0 1 0 1.7 1.7 1.7 1.7 0 0 0-1.7-1.7Z" fill="currentColor" opacity=".58" /><path d="M12 1v4m0 14v4M1 12h4m14 0h4" stroke="currentColor" strokeWidth="1.2" /></svg></span>;
    case 'spotify':
      return <span className={`brand-app-icon brand-app-${app}`}><svg {...common}><circle cx="12" cy="12" r="10" fill="currentColor" /><path d="M6.4 9.1c3.6-1 7.6-.7 10.8.6M7.1 12.2c3-.7 6.3-.4 8.9.7M8 15.1c2.2-.4 4.5-.2 6.4.6" fill="none" stroke="#102b31" strokeWidth="1.6" strokeLinecap="round" /></svg></span>;
    case 'github':
      return <span className={`brand-app-icon brand-app-${app}`}><RetroIcon name="github" size={size} /></span>;
    case 'chrome':
      return <span className={`brand-app-icon brand-app-${app}`}><svg {...common}><circle cx="12" cy="12" r="10" fill="#f4c44d" /><path d="M12 12 4.2 5.8A10 10 0 0 1 21.2 9H12Z" fill="#e95445" /><path d="M12 12h9.2a10 10 0 0 1-13.7 8.2z" fill="#55a95b" /><circle cx="12" cy="12" r="4.1" fill="#4285da" stroke="#e8f1ff" strokeWidth="1.5" /></svg></span>;
    case 'edge':
      return <span className={`brand-app-icon brand-app-${app}`}><svg {...common}><path d="M20.7 14.4c-.9 3.3-3.8 5.8-7.7 5.8-4.7 0-8-2.8-8-6.6 0-4.4 4-8.3 9.2-8.3 2.4 0 4.7 1 6.1 2.7-1.2-.7-2.5-1-3.8-1-2.8 0-5.3 1.4-6.3 3.7 2.4-1.2 7.2-1.3 10.5 1.2Z" fill="currentColor" /><path d="M4.9 13.6c.9 2.2 3.8 3.4 7.7 3.4 2.8 0 5.6-.9 7.7-2.6-.4 3.3-3.3 5.8-7.3 5.8-4.7 0-8-2.8-8-6.6Z" fill="#24c6a6" /></svg></span>;
    case 'firefox':
      return <span className={`brand-app-icon brand-app-${app}`}><svg {...common}><path d="M19.6 5.2c-2.1-1.8-5.3-2.6-8.1-1.6 1.1.2 2.1.7 2.8 1.4-3-.5-6 1-7.4 3.5C5.1 12 6.1 16.1 9.5 18c3.6 2.1 8.2.9 10.1-2.8 1.6-3.1.7-7.2-2.3-9.3.6 1.2.8 2.5.5 3.8-1.4-1.1-2.8-1.7-4.3-1.8 2.1-.9 4.2-1.2 6.1-.5Z" fill="currentColor" /><path d="M17.3 10.2c1.2 3.1-.2 6.2-3.2 7.3-3.2 1.2-6.7-.4-7.7-3.5 2.2 1.1 4.4.8 5.8-.1 1.1-.7 1.5-1.7 1.4-2.9 1.2.1 2.6-.2 3.7-.8Z" fill="#f5a33b" opacity=".92" /></svg></span>;
  }
}

function PowerScreen({ onPowerOn }: { onPowerOn: () => void }) {
  return (
    <div className="power-screen" role="dialog" aria-label="CeazarXP power screen">
      <div className="power-grid" aria-hidden="true" />
      <div className="power-panel">
        <div className="power-status"><span className="power-status-led" /> SYSTEM SLEEPING <span>CEAZARXP / STANDBY</span></div>
        <div className="power-brand"><CeazarMark /><div><strong>Ceazar<span>XP</span></strong><small>PERSONAL COMPUTER</small></div></div>
        <p className="power-prompt">Your workspace is asleep.</p>
        <button className="power-button" type="button" autoFocus onClick={onPowerOn} aria-label="Power on CeazarXP">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v8" /><path d="M6.3 6.8a8 8 0 1 0 11.4 0" /></svg><span>Power on</span>
        </button>
        <div className="power-hint"><span>PRESS TO POWER ON</span><small>or press Enter</small></div>
      </div>
      <div className="power-footer"><span>CEAZARXP BIOS v1.0</span><span>MEMORY CHECK OK</span><span>2026 / JOSHUA CEAZAR A. LOPEZ</span></div>
    </div>
  );
}

function BootScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="boot-screen" role="dialog" aria-label="CeazarXP startup screen">
      <div className="boot-wallpaper" style={{ backgroundImage: `url("${ASSETS.wallpaper}")` }} aria-hidden="true" />
      <div className="boot-shade" aria-hidden="true" />
      <div className="boot-content">
        <div className="boot-brand">
          <CeazarMark />
          <div className="boot-wordmark"><span>Joshua</span><strong>Ceazar<span className="boot-xp">XP</span></strong></div>
        </div>
        <div className="boot-context"><span>PERSONAL PORTFOLIO</span><i /> <span>DESKTOP EXPERIENCE</span></div>
        <div className="boot-loader-group">
          <div className="boot-loader-label"><span>LOADING DESKTOP</span><span>PLEASE WAIT</span></div>
          <div className="boot-loader" role="progressbar" aria-label="Loading desktop">
            <div className="boot-loader-track"><span /><span /><span /></div>
          </div>
          <div className="boot-wait"><span className="boot-status-dot" />Joshua's desktop is starting...</div>
        </div>
      </div>
      <div className="boot-footer"><span>&copy; 2026 Joshua Ceazar Lopez</span><button type="button" onClick={onEnter}>Skip startup <RetroIcon name="chevron-right" size={14} /></button></div>
    </div>
  );
}

function ExplorerHeader({ address, canGoBack, canGoForward, onBack, onForward }: { address: string; canGoBack: boolean; canGoForward: boolean; onBack: () => void; onForward: () => void }) {
  return (
    <>
      <div className="explorer-menu"><span>File</span><span>Edit</span><span>View</span><span>Favorites</span><span>Tools</span><span>Help</span></div>
      <div className="explorer-toolbar">
        <button className="toolbar-round" type="button" onClick={onBack} disabled={!canGoBack} aria-label="Back" title="Back"><span>‹</span></button>
        <button className="toolbar-round toolbar-next" type="button" onClick={onForward} disabled={!canGoForward} aria-label="Forward" title="Forward"><span>›</span></button>
        <button className="toolbar-text"><span className="toolbar-folder"><RetroIcon name="folder" size={15} /></span> Folders</button>
        <span className="toolbar-address-label">Address</span>
        <div className="toolbar-address"><RetroIcon name="monitor" size={14} /><span>{address}</span><RetroIcon name="chevron-right" size={13} /></div>
      </div>
    </>
  );
}

function ProjectTechContent({ project, embedded = false }: { project: Project; embedded?: boolean }) {
  return (
    <div className={embedded ? 'project-tech-below-gallery' : 'project-detail-view project-tech-detail'}>
      {!embedded && <div className="project-detail-heading">
        <div><span className="eyebrow">{project.kind} · {project.year}</span><h2>{project.title}</h2></div>
      </div>}
      {!embedded && <div className="project-tech-summary">
        <div className="project-tech-summary-icon"><RetroIcon name="monitor" size={21} /></div>
        <div><span className="eyebrow">PROJECT OVERVIEW</span><p>{project.description}</p></div>
      </div>}
      {embedded && <div className="project-tech-embedded-heading"><span className="eyebrow">CURATED STACK</span><h3>Notable technologies</h3></div>}
      <div className="project-tech-groups">
        {(project.stackGroups ?? []).map((group, index) => (
          <section className="project-tech-card" key={group.title}>
            <div className="project-tech-card-heading">
              <span className="project-tech-number">{String(index + 1).padStart(2, '0')}</span>
              <div><span className="eyebrow">{group.kicker}</span><h3>{group.title}</h3></div>
            </div>
            <div className="project-tech-items">
              {group.items.map((item) => <div className="project-tech-item" key={item.name}><b>{item.name}</b><p>{item.detail}</p></div>)}
            </div>
          </section>
        ))}
      </div>
      {project.techNote && <div className="project-tech-note"><RetroIcon name="hard-drive" size={15} /><span><b>{project.techNote.label}:</b> {project.techNote.detail}</span></div>}
    </div>
  );
}

function AboutContent() {
  return (
    <div className="explorer-layout">
      <aside className="task-pane">
        <div className="task-pane-title">System summary <RetroIcon name="chevron-right" size={13} /></div>
        <div className="task-pane-body">
          <div className="mini-profile"><img src={ASSETS.portrait} alt="Joshua wearing a traditional barong shirt" /><div><b>Joshua Ceazar</b><span>Developer profile</span></div></div>
          <div className="task-link"><RetroIcon name="map-pin" size={14} /> Tagum City, Philippines</div>
          <div className="task-link"><RetroIcon name="briefcase" size={14} /> Open to work</div>
          <div className="task-callout">Building responsive websites with purpose.</div>
        </div>
      </aside>
      <div className="explorer-main about-main">
        <div className="section-heading"><div className="section-heading-icon"><RetroIcon name="user" size={25} /></div><div><span className="eyebrow">ABOUT THE DEVELOPER</span><h2>Useful things, carefully made.</h2></div></div>
        <p className="lead-copy">I’m Joshua — a junior web developer who loves to develop responsive websites that have <strong>purpose.</strong></p>
        <div className="info-pair"><div className="info-cell"><span className="cell-label">LOCATION</span><b>Tagum City, Davao del Norte, Philippines</b></div><div className="info-cell"><span className="cell-label">STATUS</span><b><span className="online-dot" /> Open to work</b></div></div>
        <div className="info-cell skill-cell"><span className="cell-label">CURRENT TOOLKIT</span><div className="chip-row">{['React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Vercel', 'Node.js', 'JavaScript'].map((skill) => <span className="xp-chip" key={skill}>{skill}</span>)}</div></div>
        <div className="section-heading compact-heading"><div className="section-heading-icon"><RetroIcon name="graduation-cap" size={23} /></div><div><span className="eyebrow">EDUCATION · 2021—2025</span><h3>Bachelor of Science in Information Technology</h3><p>University of Mindanao · Tagum College</p></div></div>
        <div className="experience-title"><RetroIcon name="briefcase" size={17} /><span>PROFESSIONAL EXPERIENCE</span><b>02</b></div>
        <div className="experience-list">
          <div className="experience-item"><span className="experience-index">01</span><div><b>Frontend Developer Intern</b><span>AIMHI (Artificial Intelligence Meets Human Intelligence)</span></div><small>Apr — Jul 2025</small></div>
          <div className="experience-item"><span className="experience-index">02</span><div><b>Full Stack Web Developer</b><span>Contract of Service · TESDA Davao del Norte Provincial Office</span></div><small>Mar — Sep 2026</small></div>
        </div>
      </div>
    </div>
  );
}

function ProjectsContent({ selectedProject, navigateProject, navigateBack, isVisible }: { selectedProject: string | null; navigateProject: (id: string | null) => void; navigateBack: () => void; isVisible: boolean }) {
  const selected = projects.find((project) => project.id === selectedProject);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (!selected || !isVisible || selected.screenshots.length === 0) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setActiveSlide((current) => (current - 1 + selected.screenshots.length) % selected.screenshots.length);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        setActiveSlide((current) => (current + 1) % selected.screenshots.length);
      } else if (event.key === 'Escape') {
        navigateBack();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selected?.id, isVisible, navigateBack]);

  if (selected?.stackGroups && selected.screenshots.length === 0) return <ProjectTechContent project={selected} />;

  if (selected) {
    const slide = selected.screenshots[activeSlide] ?? selected.screenshots[0];
    const moveSlide = (direction: number) => setActiveSlide((current) => (current + direction + selected.screenshots.length) % selected.screenshots.length);
    return (
      <div className="project-detail-view">
        <div className="project-detail-heading">
          <div><span className="eyebrow">{selected.kind} · {selected.year}</span><h2>{selected.title}</h2></div>
        </div>
        <section className="project-gallery" aria-label={`${selected.title} screenshots`}>
          <div className={`project-gallery-stage${selected.id === 'noti-fire' ? ' project-gallery-stage-phone' : ' project-gallery-stage-landscape'}`}>
            <div className={`project-gallery-image-frame${selected.id === 'noti-fire' ? ' project-gallery-image-frame-phone' : ' project-gallery-image-frame-landscape'}`}>
              <img src={slide.src} alt={slide.alt} decoding="async" fetchPriority="high" />
            </div>
            <button className="gallery-arrow gallery-previous" type="button" onClick={() => moveSlide(-1)} aria-label={`Previous ${selected.title} screenshot`}>‹</button>
            <button className="gallery-arrow gallery-next" type="button" onClick={() => moveSlide(1)} aria-label={`Next ${selected.title} screenshot`}>›</button>
          </div>
          <div className="project-gallery-caption" aria-live="polite"><span>{slide.label}</span><b>{String(activeSlide + 1).padStart(2, '0')} / {String(selected.screenshots.length).padStart(2, '0')}</b></div>
          <div className={`project-gallery-thumbnails${selected.id === 'noti-fire' ? ' project-gallery-thumbnails-phone' : ''}`} role="group" aria-label="Choose a project screenshot">
            {selected.screenshots.map((screenshot, index) => <button className={activeSlide === index ? 'gallery-thumbnail gallery-thumbnail-active' : 'gallery-thumbnail'} type="button" key={screenshot.src} onClick={() => setActiveSlide(index)} aria-label={`Show screenshot ${index + 1}: ${screenshot.label}`} aria-pressed={activeSlide === index}><img src={screenshot.src} alt="" loading="lazy" decoding="async" /></button>)}
          </div>
          <div className="gallery-key-hint">Use ← → to browse · Esc or Explorer Back to return</div>
        </section>
        <div className="detail-copy"><p>{selected.description}</p><div className="chip-row">{selected.technologies.map((tech) => <span className="xp-chip" key={tech}>{tech}</span>)}</div></div>
        {selected.stackGroups && <ProjectTechContent project={selected} embedded />}
      </div>
    );
  }
  return (
    <div className="projects-explorer">
      <aside className="task-pane projects-task-pane"><div className="task-pane-title">Project tasks <RetroIcon name="chevron-right" size={13} /></div><div className="task-pane-body"><b>Choose a project</b><p>Open a case file to see what it does and which tools were used.</p><div className="task-divider" /><b>Other places</b><div className="task-link"><RetroIcon name="folder" size={14} /> My documents</div><div className="task-link"><RetroIcon name="monitor" size={14} /> My computer</div></div></aside>
      <div className="projects-list-area"><div className="folder-titlebar"><RetroIcon name="folder-open" size={18} /><span>Selected work</span><span className="folder-count">{projects.length} items</span></div>
        {projects.map((project, index) => <article className="project-row" key={project.id} role="button" tabIndex={0} aria-label={`View ${project.title} ${project.stackGroups ? (project.screenshots.length ? 'screenshots and technology stack' : 'technology stack') : 'screenshots and case file'}`} title={project.stackGroups ? (project.screenshots.length ? 'Open screenshots and technology stack' : 'Open technology stack') : 'Open project screenshots'} onClick={() => { setActiveSlide(0); navigateProject(project.id); }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setActiveSlide(0); navigateProject(project.id); } }}>
          {project.image ? <img src={project.image} alt={`${project.title} thumbnail`} loading="lazy" decoding="async" /> : <div className="portfolio-project-thumb" aria-hidden="true"><CeazarMark /></div>}
          <div className="project-row-copy"><div className="project-row-kicker">{project.kind}<span>{project.year}</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="chip-row">{project.technologies.map((tech) => <span className="xp-chip" key={tech}>{tech}</span>)}</div></div><span className="details-button" aria-hidden="true"><span>{String(index + 1).padStart(2, '0')}</span><RetroIcon name="external-link" size={15} /></span></article>)}
        <div className="folder-status">{projects.length} objects · Selected projects from the portfolio</div>
      </div>
    </div>
  );
}

function CertificatesContent() {
  return (
    <div className="certificates-page">
      <div className="certificate-intro"><div className="section-heading-icon"><RetroIcon name="award" size={25} /></div><div><span className="eyebrow">CREDENTIALS FOLDER</span><h2>Seven things learned along the way.</h2><p>A growing record of the tools behind the work.</p></div><span className="certificate-total">07<br /><small>FILES</small></span></div>
      <div className="certificate-list">
        {certificates.map((certificate, index) => <a className="certificate-row" href={certificate.file} target="_blank" rel="noreferrer" key={certificate.title}><span className={`file-icon ${certificate.type === 'JPG' ? 'file-image' : ''}`}><RetroIcon name="file" size={22} /></span><span className="certificate-number">{String(index + 1).padStart(2, '0')}</span><span className="certificate-name"><b>{certificate.title}</b><small>{certificate.provider}</small></span><span className="certificate-format">{certificate.type}</span><RetroIcon name="external-link" size={14} className="certificate-open" /></a>)}
      </div>
      <div className="certificate-footnote">Select a file to open the original certificate in a new tab.</div>
    </div>
  );
}

function ContactContent() {
  return (
    <div className="contact-page">
      <div className="contact-banner"><div className="contact-banner-mark"><RetroIcon name="mail" size={30} /></div><span className="eyebrow">AVAILABLE FOR GOOD WORK</span><h2>Let’s make something useful.</h2><p>Have a project in mind? Send Joshua a note.</p><a className="email-button" href="mailto:lopezjoshuaceazar@gmail.com?subject=Portfolio%20inquiry"><RetroIcon name="mail" size={16} /> lopezjoshuaceazar@gmail.com <RetroIcon name="external-link" size={14} /></a></div>
      <div className="contact-links-heading"><span>CONNECT / MORE INFO</span><span>OPEN A LINK <RetroIcon name="external-link" size={12} /></span></div>
      <div className="contact-link-grid">
        <a href="https://github.com/foundnemooo" target="_blank" rel="noreferrer" className="contact-link-card"><RetroIcon name="github" size={21} /><span><b>GitHub</b><small>github.com/foundnemooo</small></span><RetroIcon name="external-link" size={14} /></a>
        <a href="https://www.linkedin.com/in/joshua-ceazar-lopez-071723359/" target="_blank" rel="noreferrer" className="contact-link-card"><RetroIcon name="linkedin" size={21} /><span><b>LinkedIn</b><small>Joshua Ceazar Lopez</small></span><RetroIcon name="external-link" size={14} /></a>
        <a href={ASSETS.resume} target="_blank" rel="noreferrer" className="contact-link-card"><RetroIcon name="file" size={21} /><span><b>Résumé</b><small>Joshua_Ceazar_Lopez_Resume.pdf</small></span><RetroIcon name="external-link" size={14} /></a>
      </div>
      <div className="contact-location"><RetroIcon name="map-pin" size={15} /> Tagum City, Davao del Norte, Philippines <span>·</span> <span className="online-dot" /> Open to work</div>
    </div>
  );
}

function AppContents({ id, selectedProject, navigateProject, navigateBack, isVisible }: { id: AppId; selectedProject: string | null; navigateProject: (id: string | null) => void; navigateBack: () => void; isVisible: boolean }) {
  if (id === 'about') return <AboutContent />;
  if (id === 'projects') return <ProjectsContent selectedProject={selectedProject} navigateProject={navigateProject} navigateBack={navigateBack} isVisible={isVisible} />;
  if (id === 'certificates') return <CertificatesContent />;
  return <ContactContent />;
}

function AppWindow({
  id,
  state,
  closing,
  minimizing,
  restoring,
  restored,
  selectedProject,
  navigateProject,
  projectCanGoBack,
  projectCanGoForward,
  onProjectBack,
  onProjectForward,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onDragStart,
}: {
  id: AppId;
  state: WindowState;
  closing: boolean;
  minimizing: boolean;
  restoring: boolean;
  restored: boolean;
  selectedProject: string | null;
  navigateProject: (id: string | null) => void;
  projectCanGoBack: boolean;
  projectCanGoForward: boolean;
  onProjectBack: () => void;
  onProjectForward: () => void;
  onFocus: (id: AppId) => void;
  onClose: (id: AppId) => void;
  onMinimize: (id: AppId) => void;
  onMaximize: (id: AppId) => void;
  onDragStart: (event: ReactPointerEvent<HTMLDivElement>, id: AppId) => void;
}) {
  const { title, Icon } = WINDOW_META[id];
  const projectTitle = projects.find((project) => project.id === selectedProject)?.title;
  const folder = id === 'about' ? 'My Profile' : id === 'projects' ? 'My Projects' : id === 'certificates' ? 'My Certificates' : 'Contact';
  const address = ['C:', 'Documents and Settings', 'Joshua', folder, ...(id === 'projects' && projectTitle ? [projectTitle] : [])].join(String.fromCharCode(92));
  return (
    <section
      className={`xp-window${state.maximized ? ' window-maximized' : ''}${id === 'projects' ? ' projects-window' : ''}${restored ? ' window-restored' : ''}${restoring ? ' window-restoring' : ''}${minimizing ? ' window-minimizing' : ''}${closing ? ' window-closing' : ''}`}
      style={{ left: state.x, top: state.y, zIndex: state.z, display: state.open && !state.minimized ? 'grid' : 'none' }}
      onPointerDown={() => onFocus(id)}
      aria-label={`${title} window`}
      aria-hidden={closing || minimizing}
    >
      <div className="window-titlebar" onPointerDown={(event) => onDragStart(event, id)}>
        <div className="window-title"><span className="title-app-icon"><RetroIcon name={Icon} size={15} /></span><span>{title}</span></div>
        <div className="window-controls">
          <button className="window-control minimize-control" onPointerDown={(event) => event.stopPropagation()} onClick={() => onMinimize(id)} aria-label={`Minimize ${title}`}><RetroIcon name="minimize" size={13} /></button>
          <button className="window-control maximize-control" onPointerDown={(event) => event.stopPropagation()} onClick={() => onMaximize(id)} aria-label={state.maximized ? `Restore ${title}` : `Maximize ${title}`}><RetroIcon name="maximize" size={12} /></button>
          <button className="window-control close-control" onPointerDown={(event) => event.stopPropagation()} onClick={() => onClose(id)} aria-label={`Close ${title}`}><RetroIcon name="close" size={15} /></button>
        </div>
      </div>
      <div className="window-app-toolbar"><ExplorerHeader address={address} canGoBack={id === 'projects' && projectCanGoBack} canGoForward={id === 'projects' && projectCanGoForward} onBack={onProjectBack} onForward={onProjectForward} /></div>
      <div className="window-content"><AppContents id={id} selectedProject={selectedProject} navigateProject={navigateProject} navigateBack={onProjectBack} isVisible={state.open && !state.minimized && !closing} /></div>
      <div className="window-statusbar"><span><span className="status-led" /> Ready</span><span>{id === 'projects' ? `${projects.length} objects` : id === 'certificates' ? '7 objects' : 'Joshua Ceazar'}</span></div>
    </section>
  );
}

const DESKTOP_ITEMS: { id: AppId; label: string; Icon: RetroIconName; color: string }[] = [
  { id: 'about', label: 'About Me', Icon: 'user', color: 'icon-user' },
  { id: 'projects', label: 'My Projects', Icon: 'folder', color: 'icon-folder' },
  { id: 'certificates', label: 'Certificates', Icon: 'award', color: 'icon-award' },
  { id: 'contact', label: 'Contact', Icon: 'mail', color: 'icon-mail' },
];

function App() {
  const [startupStage, setStartupStage] = useState<'sleep' | 'boot' | 'desktop'>('sleep');
  const [booted, setBooted] = useState(false);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [closingStartMenu, setClosingStartMenu] = useState(false);
  const [now, setNow] = useState(new Date());
  const [windowStates, setWindowStates] = useState<Record<AppId, WindowState>>({ about: emptyWindow(), projects: emptyWindow(), certificates: emptyWindow(), contact: emptyWindow() });
  const [projectHistory, setProjectHistory] = useState<{ entries: (string | null)[]; index: number }>({ entries: [null], index: 0 });
  const selectedProject = projectHistory.entries[projectHistory.index] ?? null;
  const [closingApps, setClosingApps] = useState<Record<AppId, boolean>>({ about: false, projects: false, certificates: false, contact: false });
  const [minimizingApps, setMinimizingApps] = useState<Record<AppId, boolean>>({ about: false, projects: false, certificates: false, contact: false });
  const [restoringApps, setRestoringApps] = useState<Record<AppId, boolean>>({ about: false, projects: false, certificates: false, contact: false });
  const [restoredApps, setRestoredApps] = useState<Record<AppId, boolean>>({ about: false, projects: false, certificates: false, contact: false });
  const zCounter = useRef(10);
  const closeTimers = useRef<Partial<Record<AppId, number>>>({});
  const minimizeTimers = useRef<Partial<Record<AppId, number>>>({});
  const restoreTimers = useRef<Partial<Record<AppId, number>>>({});
  const startMenuCloseTimer = useRef<number | undefined>(undefined);
  const startupPlayed = useRef(false);

  const wakeComputer = useCallback(() => {
    setStartupStage((current) => current === 'sleep' ? 'boot' : current);
  }, []);

  const enterDesktop = useCallback(() => {
    if (startupPlayed.current) return;
    startupPlayed.current = true;
    playStartupSound();
    setStartupStage('desktop');
    setBooted(true);
  }, []);

  const navigateProject = useCallback((projectId: string | null) => {
    const project = projects.find((candidate) => candidate.id === projectId);
    if (project) warmProjectImages(project);
    setProjectHistory((current) => {
      if ((current.entries[current.index] ?? null) === projectId) return current;
      const entries = current.entries.slice(0, current.index + 1);
      entries.push(projectId);
      return { entries, index: entries.length - 1 };
    });
  }, []);

  const navigateProjectBack = useCallback(() => {
    setProjectHistory((current) => current.index > 0 ? { ...current, index: current.index - 1 } : current);
  }, []);

  const navigateProjectForward = useCallback(() => {
    setProjectHistory((current) => current.index < current.entries.length - 1 ? { ...current, index: current.index + 1 } : current);
  }, []);

  const closeStartMenu = useCallback(() => {
    if (!showStartMenu || closingStartMenu) return;
    setClosingStartMenu(true);
    startMenuCloseTimer.current = window.setTimeout(() => {
      startMenuCloseTimer.current = undefined;
      setShowStartMenu(false);
      setClosingStartMenu(false);
    }, START_MENU_EXIT_MS);
  }, [showStartMenu, closingStartMenu]);

  const toggleStartMenu = useCallback(() => {
    if (showStartMenu && !closingStartMenu) {
      closeStartMenu();
      return;
    }
    if (startMenuCloseTimer.current !== undefined) {
      window.clearTimeout(startMenuCloseTimer.current);
      startMenuCloseTimer.current = undefined;
    }
    setClosingStartMenu(false);
    setShowStartMenu(true);
  }, [showStartMenu, closingStartMenu, closeStartMenu]);

  const restartComputer = () => {
    if (startMenuCloseTimer.current !== undefined) {
      window.clearTimeout(startMenuCloseTimer.current);
      startMenuCloseTimer.current = undefined;
    }
    Object.values(closeTimers.current).forEach((timer) => window.clearTimeout(timer));
    Object.values(minimizeTimers.current).forEach((timer) => window.clearTimeout(timer));
    Object.values(restoreTimers.current).forEach((timer) => window.clearTimeout(timer));
    closeTimers.current = {};
    minimizeTimers.current = {};
    restoreTimers.current = {};
    setShowStartMenu(false);
    setClosingStartMenu(false);
    setWindowStates({ about: emptyWindow(), projects: emptyWindow(), certificates: emptyWindow(), contact: emptyWindow() });
    setClosingApps({ about: false, projects: false, certificates: false, contact: false });
    setMinimizingApps({ about: false, projects: false, certificates: false, contact: false });
    setRestoringApps({ about: false, projects: false, certificates: false, contact: false });
    setRestoredApps({ about: false, projects: false, certificates: false, contact: false });
    setProjectHistory({ entries: [null], index: 0 });
    zCounter.current = 10;
    setStartupStage('boot');
    setBooted(false);
    startupPlayed.current = false;
  };

  useEffect(() => {
    if (startupStage !== 'boot') return;
    const timer = window.setTimeout(enterDesktop, 2500);
    return () => window.clearTimeout(timer);
  }, [startupStage, enterDesktop]);

  useEffect(() => {
    const clock = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(clock);
  }, []);

  useEffect(() => {
    void preloadImage(ASSETS.wallpaper);
    void preloadImage(ASSETS.portrait);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        if (startupStage === 'sleep') wakeComputer();
        else if (startupStage === 'boot') enterDesktop();
      }
      if (event.key === 'Escape') closeStartMenu();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [startupStage, closeStartMenu, enterDesktop, wakeComputer]);

  const restoreWindow = (id: AppId) => {
    const wasMinimized = windowStates[id].minimized || minimizeTimers.current[id] !== undefined;
    const closeTimer = closeTimers.current[id];
    if (closeTimer !== undefined) {
      window.clearTimeout(closeTimer);
      delete closeTimers.current[id];
    }
    const minimizeTimer = minimizeTimers.current[id];
    if (minimizeTimer !== undefined) {
      window.clearTimeout(minimizeTimer);
      delete minimizeTimers.current[id];
    }
    const restoreTimer = restoreTimers.current[id];
    if (restoreTimer !== undefined) window.clearTimeout(restoreTimer);

    setClosingApps((current) => ({ ...current, [id]: false }));
    setMinimizingApps((current) => ({ ...current, [id]: false }));
    setRestoringApps((current) => ({ ...current, [id]: wasMinimized }));
    if (wasMinimized) {
      setRestoredApps((current) => ({ ...current, [id]: true }));
      restoreTimers.current[id] = window.setTimeout(() => {
        delete restoreTimers.current[id];
        setRestoringApps((current) => ({ ...current, [id]: false }));
      }, WINDOW_RESTORE_MS);
    }
    const z = ++zCounter.current;
    setWindowStates((current) => ({ ...current, [id]: { ...current[id], open: true, minimized: false, z } }));
    closeStartMenu();
  };

  const openWindow = (id: AppId) => {
    if (id === 'projects') projects.forEach((project) => project.image && void preloadImage(project.image));
    if (windowStates[id].minimized || minimizeTimers.current[id] !== undefined) {
      restoreWindow(id);
      return;
    }
    const closeTimer = closeTimers.current[id];
    if (closeTimer !== undefined) {
      window.clearTimeout(closeTimer);
      delete closeTimers.current[id];
    }
    const minimizeTimer = minimizeTimers.current[id];
    if (minimizeTimer !== undefined) {
      window.clearTimeout(minimizeTimer);
      delete minimizeTimers.current[id];
    }
    const restoreTimer = restoreTimers.current[id];
    if (restoreTimer !== undefined) {
      window.clearTimeout(restoreTimer);
      delete restoreTimers.current[id];
    }
    setClosingApps((current) => ({ ...current, [id]: false }));
    setMinimizingApps((current) => ({ ...current, [id]: false }));
    setRestoringApps((current) => ({ ...current, [id]: false }));
    if (!windowStates[id].open) setRestoredApps((current) => ({ ...current, [id]: false }));
    const z = ++zCounter.current;
    setWindowStates((current) => {
      const previous = current[id];
      const meta = WINDOW_META[id];
      const x = previous.open ? previous.x : clamp((window.innerWidth - meta.width) / 2 + (APP_IDS.indexOf(id) - 1) * 22, 8, window.innerWidth - 260);
      const y = previous.open ? previous.y : clamp((window.innerHeight - meta.height - 44) / 2 + (APP_IDS.indexOf(id) - 1) * 16, 8, window.innerHeight - 150);
      return { ...current, [id]: { ...previous, open: true, minimized: false, z, x, y } };
    });
    closeStartMenu();
  };

  const focusWindow = (id: AppId) => {
    const z = ++zCounter.current;
    setWindowStates((current) => ({ ...current, [id]: { ...current[id], z, minimized: false } }));
  };

  const updateWindow = (id: AppId, change: Partial<WindowState>) => setWindowStates((current) => ({ ...current, [id]: { ...current[id], ...change } }));

  const closeWindow = (id: AppId) => {
    if (closeTimers.current[id] !== undefined) return;
    const minimizeTimer = minimizeTimers.current[id];
    if (minimizeTimer !== undefined) {
      window.clearTimeout(minimizeTimer);
      delete minimizeTimers.current[id];
    }
    const restoreTimer = restoreTimers.current[id];
    if (restoreTimer !== undefined) {
      window.clearTimeout(restoreTimer);
      delete restoreTimers.current[id];
    }
    setMinimizingApps((current) => ({ ...current, [id]: false }));
    setRestoringApps((current) => ({ ...current, [id]: false }));
    setRestoredApps((current) => ({ ...current, [id]: false }));
    setClosingApps((current) => ({ ...current, [id]: true }));
    closeTimers.current[id] = window.setTimeout(() => {
      delete closeTimers.current[id];
      updateWindow(id, { open: false, minimized: false });
      setClosingApps((current) => ({ ...current, [id]: false }));
    }, WINDOW_EXIT_MS);
  };

  const minimizeWindow = (id: AppId) => {
    if (!windowStates[id].open || windowStates[id].minimized || minimizeTimers.current[id] !== undefined) return;
    const restoreTimer = restoreTimers.current[id];
    if (restoreTimer !== undefined) {
      window.clearTimeout(restoreTimer);
      delete restoreTimers.current[id];
    }
    setRestoringApps((current) => ({ ...current, [id]: false }));
    setMinimizingApps((current) => ({ ...current, [id]: true }));
    minimizeTimers.current[id] = window.setTimeout(() => {
      delete minimizeTimers.current[id];
      updateWindow(id, { minimized: true });
      setMinimizingApps((current) => ({ ...current, [id]: false }));
    }, WINDOW_MINIMIZE_MS);
  };

  const beginDrag = (event: ReactPointerEvent<HTMLDivElement>, id: AppId) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest('button') || windowStates[id].maximized) return;
    event.preventDefault();
    const originX = event.clientX;
    const originY = event.clientY;
    const initial = windowStates[id];
    const move = (pointer: PointerEvent) => updateWindow(id, {
      x: clamp(initial.x + pointer.clientX - originX, -240, window.innerWidth - 80),
      y: clamp(initial.y + pointer.clientY - originY, 0, window.innerHeight - 70),
    });
    const finish = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', finish);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', finish);
  };

  const openApps = APP_IDS.filter((id) => windowStates[id].open).sort((a, b) => windowStates[a].z - windowStates[b].z);
  const timeText = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(now);
  const dateText = new Intl.DateTimeFormat(undefined, { month: 'numeric', day: 'numeric', year: 'numeric' }).format(now);

  if (startupStage === 'sleep') return <PowerScreen onPowerOn={wakeComputer} />;
  if (!booted) return <BootScreen onEnter={enterDesktop} />;

  return (
    <main className="desktop" onClick={() => showStartMenu && closeStartMenu()}>
      <div className="wallpaper-motion" style={{ backgroundImage: `url("${ASSETS.wallpaper}")` }} aria-hidden="true" />
      <div className="wallpaper-animated-layer" aria-hidden="true">
        <span className="wallpaper-cloud wallpaper-cloud-primary" />
        <span className="wallpaper-cloud wallpaper-cloud-secondary" />
        <span className="wallpaper-sunbeam" />
        <span className="wallpaper-field-sheen" />
      </div>
      <div className="desktop-vignette" />
      <DesktopCursorTrail />
      <div className="desktop-label"><CeazarMark small /><span>JOSHUA CEAZAR LOPEZ</span></div>
      <section className="desktop-hero" aria-label="Joshua Ceazar introduction">
        <div className="hero-portrait">
          <span className="portrait-orbit" />
          <img src={ASSETS.portrait} alt="Joshua wearing a traditional barong shirt" loading="eager" decoding="async" fetchPriority="high" />
          <div className="portrait-label"><span>JC / 01</span><small>TAGUM CITY</small></div>
        </div>
        <div className="hero-copy">
          <h1><span className="hero-hello">hello world!</span><span className="hero-name">I'm <b>Joshua</b><span className="hero-period">.</span></span></h1>
          <p className="hero-role"><span className="hero-role-mark" aria-hidden="true">↳</span> A Junior Web Developer</p>
        </div>
        <div className="desktop-icons" aria-label="Portfolio folders">
          {DESKTOP_ITEMS.map(({ id, label, Icon, color }) => <button className="desktop-icon" key={id} onClick={(event) => { event.stopPropagation(); openWindow(id); }} onDoubleClick={(event) => { event.stopPropagation(); openWindow(id); }}>
            <span className={`desktop-icon-art ${color}`}><RetroIcon name={Icon} size={33} /></span><span className="desktop-icon-label">{label}</span>
          </button>)}
        </div>
      </section>

      {APP_IDS.map((id) => <AppWindow key={id} id={id} state={windowStates[id]} closing={closingApps[id]} minimizing={minimizingApps[id]} restoring={restoringApps[id]} restored={restoredApps[id]} selectedProject={selectedProject} navigateProject={navigateProject} projectCanGoBack={projectHistory.index > 0} projectCanGoForward={projectHistory.index < projectHistory.entries.length - 1} onProjectBack={navigateProjectBack} onProjectForward={navigateProjectForward} onFocus={focusWindow} onClose={closeWindow} onMinimize={minimizeWindow} onMaximize={(app) => updateWindow(app, { maximized: !windowStates[app].maximized })} onDragStart={beginDrag} />)}

      {showStartMenu && <div id="ceazar-start-menu" className={`start-menu start-footer-panel${closingStartMenu ? ' start-menu-closing' : ''}`} aria-hidden={closingStartMenu} onClick={(event) => event.stopPropagation()}>
        <div className="start-menu-user"><img src={ASSETS.portrait} alt="" /><div><b>Joshua Ceazar</b><span>Portfolio desktop</span></div></div>
        <div className="start-menu-columns"><div className="start-programs"><div className="start-footer-heading"><span>Explore</span><small>PORTFOLIO</small></div>{DESKTOP_ITEMS.map(({ id, label, Icon, color }) => <button key={id} onClick={() => openWindow(id)}><span className={`start-app-icon ${color}`}><RetroIcon name={Icon} size={20} /></span><span>{label}<small>{id === 'about' ? 'Profile and experience' : id === 'projects' ? 'Selected work' : id === 'certificates' ? 'Credentials' : 'Get in touch'}</small></span><RetroIcon name="chevron-right" size={13} /></button>)}</div><div className="start-shortcuts"><div className="start-footer-heading"><span>Quick links</span><small>CONNECT</small></div><button onClick={() => openWindow('projects')}><RetroIcon name="folder" size={16} /> My Projects</button><button onClick={() => openWindow('certificates')}><RetroIcon name="award" size={16} /> My Certificates</button><button onClick={() => openWindow('contact')}><RetroIcon name="mail" size={16} /> E-mail Joshua</button><div className="start-shortcut-divider" /><div className="recent-heading"><span>RECENTLY USED</span><small>DEV TOOLKIT</small></div><div className="recent-apps" aria-label="Recently used developer apps">{RECENT_APPS.map((app) => <button className="recent-app" key={app.id} type="button" title={`${app.label} — display only`} aria-label={`${app.label}, recently used developer app`}><AppBrandIcon app={app.id} size={25} /><span>{app.label}</span><small>{app.detail}</small></button>)}</div></div></div>
        <div className="start-menu-footer"><span><span className="online-dot" /> Available for new work</span><button onClick={restartComputer} aria-label="Restart desktop"><RetroIcon name="power" size={16} /> Restart</button></div>
      </div>}

      <div className={`taskbar${openApps.length ? ' taskbar-has-apps' : ''}`} onClick={(event) => event.stopPropagation()}>
        <button className={`start-button${showStartMenu && !closingStartMenu ? ' start-button-active' : ''}${closingStartMenu ? ' start-button-closing' : ''}`} onClick={toggleStartMenu} aria-expanded={showStartMenu && !closingStartMenu} aria-controls="ceazar-start-menu"><CeazarMark /><i>start</i></button>
        <div className="quick-launch"><button onClick={() => openWindow('about')} aria-label="About Me"><RetroIcon name="monitor" size={16} /></button><span className="quick-separator" /><button onClick={() => openWindow('projects')} aria-label="Open projects"><RetroIcon name="folder-open" size={17} /></button></div>
        <div className="taskbar-apps">{openApps.map((id) => { const { Icon } = WINDOW_META[id]; const minimized = windowStates[id].minimized; const transitioning = minimizingApps[id]; const closing = closingApps[id]; return <button key={id} className={`taskbar-app${!minimized && !transitioning && !closing && Math.max(...openApps.map((app) => windowStates[app].z)) === windowStates[id].z ? ' taskbar-app-active' : ''}${minimized || transitioning ? ' taskbar-app-minimized' : ''}${transitioning ? ' taskbar-app-minimizing' : ''}`} onClick={() => minimized || transitioning || closing ? restoreWindow(id) : minimizeWindow(id)}><RetroIcon name={Icon} size={15} /><span>{WINDOW_META[id].title}</span></button>; })}</div>
        <div className="system-tray"><span className="tray-icon"><RetroIcon name="hard-drive" size={14} /></span><span className="tray-icon network-bars">◔</span><div className="tray-clock"><span>{timeText}</span><small>{dateText}</small></div></div>
      </div>
    </main>
  );
}

export default App;
