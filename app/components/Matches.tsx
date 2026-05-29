'use client';
import { useState } from 'react';
import type { NetworkNode } from '@/lib/types';
import { Avatar } from './Shell';
import { Icon } from './Icons';

export function Matches({ nodes }: { nodes: NetworkNode[] }) {
  const [activeId, setActiveId] = useState('n1');
  const active = nodes.find(n => n.id === activeId);
  const you = nodes.find(n => n.you);
  const pct = active?.score ?? 0;

  return (
    <div className="constellation-shell">
      <div className="constellation-stage">
        <div className="constellation-head">
          <div>
            <div className="constellation-title">5 new matches for you</div>
            <div className="constellation-sub">based on your thesis, last 30 accepts, and 2nd-degree graph</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn sm"><Icon name="refresh" size={14} className="ic-sm" />Refresh</button>
            <button className="btn sm"><Icon name="filter" size={14} className="ic-sm" />Filters</button>
          </div>
        </div>

        <svg className="constellation-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          {nodes.filter(n => !n.you && you).map(n => {
            const a = Math.max(0.08, (n.score ?? 0) / 100 * 0.8);
            const isActive = n.id === activeId;
            return (
              <line key={n.id}
                x1={you!.x} y1={you!.y} x2={n.x} y2={n.y}
                stroke={isActive ? 'var(--accent)' : 'var(--fg-dim)'}
                strokeOpacity={isActive ? 0.9 : a * 0.3}
                strokeWidth={isActive ? 0.3 : 0.15}
                strokeDasharray={isActive ? '0' : '0.4 0.4'}
              />
            );
          })}
        </svg>

        {nodes.map(n => (
          <div key={n.id}
            className={`node ${n.you ? 'you' : ''} ${n.id === activeId ? 'active' : ''}`}
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
            onClick={() => !n.you && setActiveId(n.id)}
          >
            <Avatar p={{ color: n.color, initials: n.initials }} size={n.you ? 'lg' : 'md'} />
            <div className="node-label">{n.name}</div>
            {n.score != null && <div className="node-score">{n.score}% fit</div>}
          </div>
        ))}
      </div>

      <div className="match-panel scroll">
        {active && (
          <>
            <div className="match-card">
              <div className="match-card-head">
                <Avatar p={{ color: active.color, initials: active.initials }} size="lg" />
                <div style={{ flex: 1 }}>
                  <div className="detail-sender-name">{active.name}</div>
                  <div className="detail-sender-sub">{active.role}</div>
                </div>
                <div className="match-score-ring" style={{ ['--pct' as string]: `${pct * 3.6}deg` }}>
                  <span>{pct}</span>
                </div>
              </div>
              <div className="match-card-body">
                <div className="detail-section-h">Why this match</div>
                <div style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--fg)' }}>{active.why}</div>
                <div className="detail-section-h" style={{ marginTop: 14 }}>Overlap</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {active.overlap?.map(t => <span key={t} className="chip accent">{t}</span>)}
                </div>
              </div>
            </div>

            <div style={{ padding: 'var(--pad-5)' }}>
              <IntroDraft active={active} />
              <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
                <button className="btn primary" style={{ flex: 1, justifyContent: 'center' }}>
                  <Icon name="send" size={14} className="ic-sm" />Send warm intro
                </button>
                <button className="btn">Edit</button>
                <button className="btn ghost">Skip</button>
              </div>
              <div className="tiny mute mono" style={{ marginTop: 10, textAlign: 'center' }}>
                ✦ delivered via email + native message · both parties must opt-in
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function IntroDraft({ active }: { active: NetworkNode }) {
  return (
    <div className="intro-draft">
      <div className="intro-draft-head">
        <Icon name="spark" size={12} className="ic-sm" style={{ color: 'var(--accent)' }} />
        AI warm intro · draft
        <span className="intro-draft-pill">✦ personalised</span>
      </div>
      <div className="intro-lines">
        <p><strong>Subject:</strong> {active.name} ↔ Maya — <span className="hl">{active.overlap?.[0]}</span></p>
        <p>Hi both —</p>
        <p>
          Double opt-in intro. <strong>{active.name}</strong> ({active.role}) — meet <strong>Maya Chen</strong>, angel investor and ex-Stripe PM. You both think a lot about <span className="hl">{active.overlap?.[0]}</span>{active.overlap?.[1] ? <> and <span className="hl">{active.overlap[1]}</span></> : null}.
        </p>
        <p>Maya — {active.name?.split(' ')[0]} is working on things that map directly to your thesis. {active.why?.split('.')[0]}.</p>
        <p>{active.name?.split(' ')[0]} — Maya has made <span className="hl">4 intros</span> to founders in your space this quarter and is an unusually direct operator.</p>
        <p>I'll let you take it from here. ✦</p>
      </div>
    </div>
  );
}
