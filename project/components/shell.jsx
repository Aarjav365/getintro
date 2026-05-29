// Sidebar, Topbar, Avatar, small shared pieces
const { useState, useEffect, useRef, useMemo } = React;

function Avatar({ p, size = 'md', className = '' }) {
  if (!p) return null;
  return <div className={`avatar ${size !== 'md' ? size : ''} ${className}`} data-color={p.color}>{p.initials}</div>;
}

function Sidebar({ route, setRoute, persona, setPersonaKey, counts }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">gi</div>
        <div className="brand-name">Get Intro</div>
        <div className="brand-tag">v1</div>
      </div>
      <div className="persona-card" onClick={() => setPersonaKey()} title="Switch persona">
        <Avatar p={persona.avatar} />
        <div className="persona-meta">
          <div className="persona-name">{persona.name}</div>
          <div className="persona-role">@{persona.handle}</div>
        </div>
        <Icon name="dots" size={14} className="persona-arrow" />
      </div>
      <div className="nav">
        <NavItem icon="inbox" label="Inbox" active={route==='inbox'} onClick={()=>setRoute('inbox')} count={counts.pending} />
        <NavItem icon="match" label="AI matches" active={route==='matches'} onClick={()=>setRoute('matches')} badge="3" />
        <NavItem icon="spark" label="Connector setup" active={route==='connector'} onClick={()=>setRoute('connector')} />
        <div className="nav-section-label">Your link</div>
        <NavItem icon="link" label="Public profile" active={route==='public'} onClick={()=>setRoute('public')} />
        <NavItem icon="cog" label="Request types" active={route==='types'} onClick={()=>setRoute('types')} count="6" />
        <div className="nav-section-label">Community</div>
        <NavItem icon="users" label="On Deck Fintech" active={route==='community'} onClick={()=>setRoute('community')} />
      </div>
      <div className="sidebar-footer">
        <NavItem icon="shield" label="Settings" active={route==='settings'} onClick={()=>setRoute('settings')} />
        <div className="chip" style={{alignSelf:'flex-start'}}>
          <span className="dot accent"/>· Plan: Pro
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active, onClick, count, badge }) {
  return (
    <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      <Icon name={icon} size={16} className="nav-icon ic" />
      <span>{label}</span>
      {count && <span className="nav-count">{count}</span>}
      {badge && <span className="nav-badge">{badge}</span>}
    </div>
  );
}

function Topbar({ crumbs = [], right, onMenu }) {
  return (
    <div className="topbar">
      {onMenu && <button className="btn icon ghost" onClick={onMenu}><Icon name="menu" size={18} className="ic"/></button>}
      <div className="topbar-title">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="topbar-crumb-sep">/</span>}
            <span className={i === crumbs.length - 1 ? '' : 'topbar-crumb'}>{c}</span>
          </React.Fragment>
        ))}
      </div>
      <div className="topbar-right">
        {right}
        <div className="search" style={{maxWidth: 220}}>
          <Icon name="search" size={14} className="ic" />
          <input placeholder="Search requests, people…" />
          <span className="kbd">⌘K</span>
        </div>
        <button className="btn icon ghost"><Icon name="bell" size={16} className="ic"/></button>
      </div>
    </div>
  );
}

window.Avatar = Avatar;
window.Sidebar = Sidebar;
window.Topbar = Topbar;
window.NavItem = NavItem;
