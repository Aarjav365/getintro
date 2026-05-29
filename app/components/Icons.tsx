'use client';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Icon({ name, size = 16, className = 'ic', style }: IconProps) {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const, className, style,
  };
  const paths: Record<string, React.ReactNode> = {
    inbox: <><path d="M4 13 L4 7 A2 2 0 0 1 6 5 L18 5 A2 2 0 0 1 20 7 L20 13"/><path d="M4 13 L9 13 L10 16 L14 16 L15 13 L20 13 L20 18 A2 2 0 0 1 18 20 L6 20 A2 2 0 0 1 4 18 Z"/></>,
    match: <><circle cx="7" cy="8" r="3"/><circle cx="17" cy="8" r="3"/><path d="M7 13 v3 a4 4 0 0 0 4 4 h2 a4 4 0 0 0 4-4 v-3"/><path d="M10 18 L14 18"/></>,
    link: <><path d="M9 15 L15 9"/><path d="M10.5 5.5 L13 3 a4 4 0 0 1 6 6 l-2.5 2.5"/><path d="M13.5 18.5 L11 21 a4 4 0 0 1 -6 -6 l2.5 -2.5"/></>,
    spark: <><path d="M12 3 L13.5 9 L19 10.5 L13.5 12 L12 18 L10.5 12 L5 10.5 L10.5 9 Z"/></>,
    chart: <><path d="M4 20 L4 4"/><path d="M4 20 L20 20"/><path d="M7 16 L11 10 L14 13 L19 6"/></>,
    cog: <><circle cx="12" cy="12" r="3"/><path d="M12 3 L12 5 M12 19 L12 21 M3 12 L5 12 M19 12 L21 12 M5.6 5.6 L7 7 M17 17 L18.4 18.4 M5.6 18.4 L7 17 M17 7 L18.4 5.6"/></>,
    bell: <><path d="M6 9 a6 6 0 0 1 12 0 v4 l2 3 H4 l2 -3 Z"/><path d="M10 19 a2 2 0 0 0 4 0"/></>,
    search: <><circle cx="11" cy="11" r="6"/><path d="M15.5 15.5 L20 20"/></>,
    plus: <><path d="M12 5 L12 19 M5 12 L19 12"/></>,
    arrow: <><path d="M5 12 L19 12 M13 6 L19 12 L13 18"/></>,
    arrowLeft: <><path d="M19 12 L5 12 M11 6 L5 12 L11 18"/></>,
    check: <><path d="M5 12 L10 17 L19 7"/></>,
    x: <><path d="M6 6 L18 18 M18 6 L6 18"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21 c 0 -5 4 -8 8 -8 s 8 3 8 8"/></>,
    users: <><circle cx="9" cy="8" r="3.5"/><path d="M2 21 c 0 -4 3.5 -6.5 7 -6.5 s 7 2.5 7 6.5"/><circle cx="17" cy="6" r="3"/><path d="M14 15.5 c 1 -0.5 2 -0.8 3 -0.8 c 3 0 5 2 5 5.3"/></>,
    filter: <><path d="M4 5 L20 5 L14 12 L14 19 L10 17 L10 12 Z"/></>,
    dots: <><circle cx="6" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="18" cy="12" r="1.3"/></>,
    send: <><path d="M21 3 L11 14"/><path d="M21 3 L14 21 L11 14 L3 11 Z"/></>,
    calendar: <><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 10 L20 10 M9 3 L9 7 M15 3 L15 7"/></>,
    external: <><path d="M14 5 L19 5 L19 10"/><path d="M19 5 L10 14"/><path d="M12 5 L6 5 A2 2 0 0 0 4 7 L4 18 A2 2 0 0 0 6 20 L17 20 A2 2 0 0 0 19 18 L19 12"/></>,
    archive: <><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8 L5 20 L19 20 L19 8"/><path d="M10 13 L14 13"/></>,
    flag: <><path d="M5 21 L5 4 L16 4 L14 8 L16 12 L5 12"/></>,
    clock: <><circle cx="12" cy="12" r="8"/><path d="M12 7 L12 12 L15 14"/></>,
    shield: <><path d="M12 3 L20 6 L20 12 c 0 5 -4 8 -8 9 c -4 -1 -8 -4 -8 -9 L4 6 Z"/></>,
    accept: <><circle cx="12" cy="12" r="9"/><path d="M8 12 L11 15 L16 10"/></>,
    reject: <><circle cx="12" cy="12" r="9"/><path d="M9 9 L15 15 M15 9 L9 15"/></>,
    refresh: <><path d="M4 12 a8 8 0 0 1 14 -5 L20 7 M20 4 L20 7 L17 7"/><path d="M20 12 a8 8 0 0 1 -14 5 L4 17 M4 20 L4 17 L7 17"/></>,
    menu: <><path d="M4 6 L20 6 M4 12 L20 12 M4 18 L20 18"/></>,
    triangleLeft: <><path d="M15 6 L9 12 L15 18"/></>,
    triangleRight: <><path d="M9 6 L15 12 L9 18"/></>,
    at: <><circle cx="12" cy="12" r="4"/><path d="M16 8 L16 14 a3 3 0 0 0 6 0 v-2 a10 10 0 1 0 -4 8"/></>,
    verified: <><path d="M12 2 L14.5 4.5 L18 4.5 L18 8 L20.5 10 L18 12 L18 15.5 L14.5 15.5 L12 18 L9.5 15.5 L6 15.5 L6 12 L3.5 10 L6 8 L6 4.5 L9.5 4.5 Z"/><path d="M9 10 L11 12 L15 8"/></>,
  };
  return <svg {...props}>{paths[name] ?? null}</svg>;
}
