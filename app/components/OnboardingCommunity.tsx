'use client';
import { useState } from 'react';
import type { Persona, RequestTypeConfig, CommunityData } from '@/lib/types';
import { Avatar } from './Shell';
import { Icon } from './Icons';

/* ---------- Toggle ---------- */
export function Toggle({ defaultOn = false, onChange }: { defaultOn?: boolean; onChange?: (v: boolean) => void }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => { setOn(!on); onChange?.(!on); }}
      style={{ width: 36, height: 20, borderRadius: 999, background: on ? 'var(--accent)' : 'var(--bg-3)', border: '1px solid var(--line)', position: 'relative', transition: 'background .15s' }}
    >
      <span style={{ position: 'absolute', top: 1, left: on ? 17 : 1, width: 16, height: 16, borderRadius: '50%', background: on ? 'var(--accent-ink)' : 'var(--fg-dim)', transition: 'left .15s' }} />
    </button>
  );
}

/* ---------- Onboarding ---------- */
export function Onboarding({ persona, types, onDone }: { persona: Persona; types: RequestTypeConfig[]; onDone: () => void }) {
  const [step, setStep] = useState(1);
  const [handle, setHandle] = useState(persona.handle);
  const [selected, setSelected] = useState(new Set(['call', 'mentor', 'collab']));
  const total = 3;

  const toggle = (id: string) => {
    const n = new Set(selected);
    if (n.has(id)) n.delete(id); else n.add(id);
    setSelected(n);
  };

  return (
    <div className="onboarding-wrap">
      <div className="onboarding-head">
        <div className="brand">
          <div className="brand-mark">gi</div>
          <div className="brand-name">Get Intro</div>
        </div>
        <div className="onboarding-progress">
          <span>step {step} / {total}</span>
          <div className="progress-bar">
            {Array.from({ length: total }).map((_, i) => (
              <span key={i} className={`progress-tick ${i < step ? 'filled' : ''}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="onb-stage">
        {step === 1 && (
          <div className="onb-panel">
            <div>
              <div className="onb-title">Claim your link.</div>
              <div className="onb-sub">One URL that holds every way someone can reach you. Share it once — everything routes here.</div>
            </div>
            <div>
              <div className="field-label" style={{ marginBottom: 8 }}>Your handle</div>
              <div className="handle-row">
                <div className="handle-row-prefix">getintro.to/</div>
                <input className="handle-row-input" value={handle} onChange={e => setHandle(e.target.value.replace(/\s/g, ''))} />
                <div className="handle-row-status"><Icon name="check" size={12} className="ic-sm" />available</div>
              </div>
              <div className="tiny mute mono" style={{ marginTop: 8 }}>✦ we'll also grab @{handle} on X, LinkedIn, and reserve the vanity on native chat.</div>
            </div>
            <div className="onb-actions">
              <div style={{ flex: 1 }} />
              <button className="btn primary lg" onClick={() => setStep(2)}>Continue<Icon name="arrow" size={14} className="ic-sm" /></button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="onb-panel">
            <div>
              <div className="onb-title">What can people ask for?</div>
              <div className="onb-sub">Pick the request types that match how you want to be reached.</div>
            </div>
            <div className="type-picker">
              {types.map(t => (
                <div key={t.id} className={`type-pick-card ${selected.has(t.id) ? 'selected' : ''}`} onClick={() => toggle(t.id)}>
                  <div className="type-pick-icon">{t.icon}</div>
                  <div>
                    <div className="type-pick-name">{t.name}</div>
                    <div className="type-pick-desc">{t.price}{t.free ? '' : ' · auto-collected'}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="onb-actions">
              <button className="btn" onClick={() => setStep(1)}><Icon name="arrowLeft" size={14} className="ic-sm" />Back</button>
              <div style={{ flex: 1 }} />
              <button className="btn primary lg" onClick={() => setStep(3)}>Continue<Icon name="arrow" size={14} className="ic-sm" /></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="onb-panel">
            <div>
              <div className="onb-title">Train the connector.</div>
              <div className="onb-sub">The model reads your LinkedIn, writing, and accept history to learn your thesis.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { k: 'li', label: 'LinkedIn profile', sub: 'Companies, roles, education', on: true },
                { k: 'wr', label: 'Public writing', sub: 'Substack, essays, tweets', on: true },
                { k: 'ac', label: 'Accept/decline history', sub: 'Learn from past decisions', on: true },
                { k: 'ca', label: 'Calendar (last 90d)', sub: 'Private. Used only for meeting patterns.', on: false },
              ].map(src => (
                <div key={src.k} className="card" style={{ padding: 'var(--pad-3)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{src.label}</div>
                    <div className="tiny mute">{src.sub}</div>
                  </div>
                  <Toggle defaultOn={src.on} />
                </div>
              ))}
            </div>
            <div className="onb-actions">
              <button className="btn" onClick={() => setStep(2)}><Icon name="arrowLeft" size={14} className="ic-sm" />Back</button>
              <div style={{ flex: 1 }} />
              <button className="btn primary lg" onClick={onDone}><Icon name="spark" size={14} className="ic-sm" />Finish setup</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Community admin ---------- */
export function Community({ data }: { data: CommunityData }) {
  const c = data;
  return (
    <div className="community-wrap">
      <div className="hero-head">
        <div>
          <h1 className="hero-title">{c.name}</h1>
          <div className="hero-sub">Private network · <span className="mono">{c.members}</span> members · admin view</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn"><Icon name="users" size={14} className="ic-sm" />Invite</button>
          <button className="btn primary"><Icon name="spark" size={14} className="ic-sm" />Run batch match</button>
        </div>
      </div>

      <div className="kpi-grid">
        {c.kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="community-grid">
        <div className="intro-flow">
          <div className="intro-flow-head">
            <div>
              <div style={{ fontWeight: 500 }}>Intro funnel · last 30 days</div>
              <div className="tiny mute mono">profile view → intro made</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn sm">30d</button>
              <button className="btn sm ghost">90d</button>
              <button className="btn sm ghost">All</button>
            </div>
          </div>
          {c.funnel.map(s => (
            <div key={s.label} className="sankey-row">
              <div>
                <div className="sankey-label">{s.label}</div>
                <div className="sankey-label-sub">{s.sub}</div>
              </div>
              <div className="sankey-bar">
                <div className="sankey-bar-fill" style={{ width: `${s.pct * 100}%`, opacity: 0.4 + s.pct * 0.8 }} />
              </div>
              <div className="sankey-count">{s.count.toLocaleString()}</div>
            </div>
          ))}
          <div className="tiny mute mono" style={{ marginTop: 14 }}>
            ✦ AI rerouting saved <span style={{ color: 'var(--accent)' }}>84 misaddressed requests</span> this month · 23% of total volume
          </div>
        </div>

        <div className="leaderboard">
          <div style={{ fontWeight: 500, marginBottom: 10 }}>Top connectors</div>
          <div className="tiny mute mono" style={{ marginBottom: 10 }}>warm intros made · last 30d</div>
          {c.leaders.map(l => (
            <div key={l.name} className="leader-row">
              <div className={`leader-rank ${l.rank <= 3 ? 'top' : ''}`}>{String(l.rank).padStart(2, '0')}</div>
              <Avatar p={{ color: (['amber', 'blue', 'green', 'teal', 'purple', 'pink', 'slate'] as const)[l.rank % 7], initials: l.name.split(' ').map(x => x[0]).join('') }} size="sm" />
              <div>
                <div className="leader-name">{l.name}</div>
                <div className="leader-role">{l.role}</div>
              </div>
              <div className="leader-val">{l.val}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 'var(--pad-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <div style={{ fontWeight: 500 }}>Pending intros awaiting admin approval</div>
            <div className="tiny mute mono">high-leverage matches routed through you</div>
          </div>
          <span className="chip accent mono" style={{ marginLeft: 8 }}>4 new</span>
          <div style={{ flex: 1 }} />
          <button className="btn sm">Open queue</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            ['Yuki Okabe', 'Devon Okafor', '91% · founder/investor'],
            ['Lena Torres', 'Mira Chen', '84% · CFO/platform hire'],
            ['Kofi Asare', 'Amelia Novak', '78% · story angle'],
            ['Sana Ravi', 'Maya Chen', '76% · co-invest'],
          ].map(([a, b, note], i) => (
            <div key={i} className="card" style={{ padding: 'var(--pad-3)', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-1)' }}>
              <Avatar p={{ color: 'blue', initials: a.split(' ').map(x => x[0]).join('') }} size="sm" />
              <span className="mono tiny mute">↔</span>
              <Avatar p={{ color: 'amber', initials: b.split(' ').map(x => x[0]).join('') }} size="sm" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="tiny" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a} × {b}</div>
                <div className="tiny mute mono">{note}</div>
              </div>
              <button className="btn sm primary">✓</button>
              <button className="btn sm ghost">✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, delta, spark }: { label: string; value: string; delta: string; spark: number[] }) {
  const max = Math.max(...spark), min = Math.min(...spark);
  const norm = spark.map(v => (v - min) / (max - min || 1));
  const d = norm.map((v, i) => `${(i / (spark.length - 1)) * 100},${30 - v * 26}`).join(' ');
  const neg = delta?.startsWith('-') && label !== 'Avg turnaround';
  return (
    <div className="kpi-card">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="kpi-label">{label}</div>
        <div className={`kpi-delta ${neg ? 'neg' : ''}`} style={{ marginLeft: 'auto' }}>{delta}</div>
      </div>
      <div className="kpi-value">{value}</div>
      <svg className="kpi-spark" viewBox="0 0 100 30" preserveAspectRatio="none">
        <polyline points={d} fill="none" stroke="var(--accent)" strokeWidth="1.5" />
        <polyline points={`${d} 100,30 0,30`} fill="var(--accent-soft)" stroke="none" />
      </svg>
    </div>
  );
}

/* ---------- Request types settings ---------- */
export function RequestTypesSettings({ types }: { types: RequestTypeConfig[] }) {
  return (
    <div className="connector-wrap">
      <div className="hero-head">
        <div>
          <h1 className="hero-title">Request types</h1>
          <div className="hero-sub">Customise the menu on your public link. Each type gets its own price, form, and auto-reply policy.</div>
        </div>
        <button className="btn primary"><Icon name="plus" size={14} className="ic-sm" />New type</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
        {types.map(t => (
          <div key={t.id} className="card" style={{ padding: 'var(--pad-4)', display: 'flex', gap: 14, alignItems: 'center' }}>
            <div className="request-type-icon" style={{ width: 44, height: 44 }}>{t.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{t.name}</div>
              <div className="tiny mute">{t.desc}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                {t.fields.map(f => <span key={f} className="chip mono tiny">{f}</span>)}
              </div>
            </div>
            <div className={`request-type-price ${t.free ? 'free' : ''}`}>{t.price}</div>
            <Toggle defaultOn={true} />
            <button className="btn sm"><Icon name="cog" size={14} className="ic-sm" />Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}
