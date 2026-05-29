'use client';
import { type ReactNode } from 'react';
import type { Persona } from '@/lib/types';
import { Icon } from './Icons';

/* ---------- Avatar ---------- */
interface AvatarProps {
  p?: { color?: string; initials?: string } | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}
export function Avatar({ p, size = 'md', className = '' }: AvatarProps) {
  if (!p) return null;
  return (
    <div className={`avatar ${size !== 'md' ? size : ''} ${className}`} data-color={p.color}>
      {p.initials}
    </div>
  );
}

/* ---------- NavItem ---------- */
interface NavItemProps {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number | string;
  badge?: string;
}
export function NavItem({ icon, label, active, onClick, count, badge }: NavItemProps) {
  return (
    <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      <Icon name={icon} size={16} className="nav-icon ic" />
      <span>{label}</span>
      {count !== undefined && <span className="nav-count">{count}</span>}
      {badge && <span className="nav-badge">{badge}</span>}
    </div>
  );
}

/* ---------- Topbar ---------- */
interface TopbarProps {
  crumbs?: string[];
  right?: ReactNode;
  onMenu?: (() => void) | null;
  realtimeConnected?: boolean;
  onTweaks?: () => void;
}
export function Topbar({ crumbs = [], right, onMenu, realtimeConnected, onTweaks }: TopbarProps) {
  return (
    <div className="topbar">
      {onMenu && (
        <button className="btn icon ghost" onClick={onMenu}>
          <Icon name="menu" size={18} className="ic" />
        </button>
      )}
      <div className="topbar-title">
        {crumbs.map((c, i) => (
          <span key={i}>
            {i > 0 && <span className="topbar-crumb-sep"> / </span>}
            <span className={i === crumbs.length - 1 ? '' : 'topbar-crumb'}>{c}</span>
          </span>
        ))}
      </div>
      <div className="topbar-right">
        {right}
        {realtimeConnected && (
          <div className="realtime-badge">
            <span className="dot" />live
          </div>
        )}
        <div className="search" style={{ maxWidth: 220 }}>
          <Icon name="search" size={14} className="ic" />
          <input placeholder="Search requests, people…" />
          <span className="kbd">⌘K</span>
        </div>
        <button className="btn icon ghost">
          <Icon name="bell" size={16} className="ic" />
        </button>
        {onTweaks && (
          <button className="btn sm ghost" onClick={onTweaks} title="Tweaks">
            <Icon name="cog" size={14} className="ic-sm" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- Shell (full layout) ---------- */
interface ShellNavItem {
  route: string;
  icon: string;
  label: string;
}

interface ShellProps {
  children: ReactNode;
  persona: Persona;
  route: string;
  navItems: ShellNavItem[];
  sidebarOpen?: boolean;
  onMenu?: () => void;
  onNav: (route: string) => void;
  onTweaks?: () => void;
  realtimeConnected?: boolean;
  crumbs?: string[];
  unreadCount?: number;
}

export function Shell({
  children, persona, route, navItems, sidebarOpen, onMenu, onNav,
  onTweaks, realtimeConnected, crumbs = [], unreadCount = 0,
}: ShellProps) {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">gi</div>
          <div className="brand-name">Get Intro</div>
          <div className="brand-tag">v1</div>
        </div>
        <div className="persona-card" title="Switch persona">
          <Avatar p={persona.avatar} />
          <div className="persona-meta">
            <div className="persona-name">{persona.name}</div>
            <div className="persona-role">@{persona.handle}</div>
          </div>
          <Icon name="dots" size={14} className="persona-arrow" />
        </div>
        <div className="nav">
          {navItems.map(item => (
            <NavItem
              key={item.route}
              icon={item.icon}
              label={item.label}
              active={route === item.route}
              onClick={() => onNav(item.route)}
              count={item.route === 'inbox' ? (unreadCount || undefined) : undefined}
            />
          ))}
        </div>
        <div className="sidebar-footer">
          <NavItem icon="shield" label="Settings" active={false} onClick={() => {}} />
          <div className="chip" style={{ alignSelf: 'flex-start' }}>
            <span className="dot accent" />· Plan: Pro
          </div>
        </div>
      </aside>
      <div className="main">
        <Topbar
          crumbs={crumbs}
          onMenu={onMenu}
          realtimeConnected={realtimeConnected}
          onTweaks={onTweaks}
        />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}
