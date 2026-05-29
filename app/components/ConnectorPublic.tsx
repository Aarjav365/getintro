'use client';
import { useState } from 'react';
import type { Persona, RequestTypeConfig } from '@/lib/types';
import { Icon } from './Icons';
import { Avatar } from './Shell';

/* ---------- Connector setup ---------- */
export function ConnectorSetup({ persona }: { persona: Persona }) {
  const [weights, setWeights] = useState({ thesis: 70, warm: 85, active: 60, geo: 30 });
  const setW = (k: keyof typeof weights, v: number) => setWeights(w => ({ ...w, [k]: v }));

  return (
    <div className="connector-wrap">
      <div className="hero-head">
        <div>
          <h1 className="hero-title">Train your <em>connector.</em></h1>
          <div className="hero-sub">Tell the model who you are and who you want to meet. It runs quietly in the background and proposes one warm intro per week — you approve, it sends.</div>
        </div>
        <button className="btn primary lg"><Icon name="spark" size={16} className="ic" />Save & activate</button>
      </div>

      <div className="identity-grid">
        <div className="identity-card">
          <div className="identity-card-head"><span className="identity-card-head-num">01</span>Who you are</div>
          <div className="identity-input" data-editable="true">
            <textarea defaultValue="Angel investor writing $25–100k checks into fintech & developer-facing infra. Previously 2nd PM at Stripe, shipped Billing and Connect. I care about deeply technical founders shipping boring-but-hard infrastructure. I'm most useful during 0→1 on GTM and pricing." />
          </div>
          <div className="detail-section-h">Traits surfaced by AI</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className="chip accent">fintech</span>
            <span className="chip accent">dev infra</span>
            <span className="chip accent">angel · pre-seed to seed</span>
            <span className="chip">pricing</span>
            <span className="chip">b2b GTM</span>
          </div>
        </div>

        <div className="identity-card">
          <div className="identity-card-head"><span className="identity-card-head-num">02</span>Who you want to meet</div>
          <div className="tag-input">
            {['Fintech GPs writing Series A', 'Founders building dev infra · pre-seed', 'Technical writers covering fintech', 'Heads of platform at Ramp/Mercury/Brex'].map((t, i) => (
              <span key={t} className={`tag-chip ${i === 1 ? 'accent' : ''}`}>{t}</span>
            ))}
            <span className="tag-input-field" contentEditable suppressContentEditableWarning>+ add intent…</span>
          </div>
          <div className="detail-section-h" style={{ marginTop: 4 }}>Avoid</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['web3 infrastructure', 'crypto exchanges', 'pure AI chat apps'].map(t => (
              <span key={t} className="chip bad">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 'var(--pad-5)' }}>
        <div className="identity-card-head" style={{ marginBottom: 10 }}><span className="identity-card-head-num">03</span>Matching weights</div>
        <WeightRow label="Thesis fit" desc="How closely their work matches your stated intent" v={weights.thesis} onChange={v => setW('thesis', v)} />
        <WeightRow label="Warmth of connection" desc="2nd-degree > 3rd-degree. Prefer mutuals." v={weights.warm} onChange={v => setW('warm', v)} />
        <WeightRow label="Recent activity" desc="Actively raising, hiring, or writing in the last 30d" v={weights.active} onChange={v => setW('active', v)} />
        <WeightRow label="Geographic proximity" desc="Same city = higher signal" v={weights.geo} onChange={v => setW('geo', v)} />
      </div>

      <div className="card" style={{ padding: 'var(--pad-5)', display: 'flex', alignItems: 'center', gap: 14 }}>
        <Icon name="clock" size={22} className="ic-lg" style={{ color: 'var(--accent)' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500 }}>Cadence: <span className="mono">1 suggested intro / week</span></div>
          <div className="tiny mute" style={{ marginTop: 2 }}>You'll see the match on Mondays at 9am. Nothing sends without your approval.</div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="btn sm">Daily</button>
          <button className="btn sm primary">Weekly</button>
          <button className="btn sm">Monthly</button>
          <button className="btn sm ghost">Off</button>
        </div>
      </div>
    </div>
  );
}

function WeightRow({ label, desc, v, onChange }: { label: string; desc: string; v: number; onChange: (v: number) => void }) {
  return (
    <div className="weight-row">
      <div style={{ flex: 1 }}>
        <div className="weight-label">{label}</div>
        <div className="weight-desc">{desc}</div>
      </div>
      <input className="weight-slider" type="range" min="0" max="100" value={v} onChange={e => onChange(+e.target.value)} />
      <div className="mono tiny" style={{ width: 32, textAlign: 'right' }}>{v}</div>
    </div>
  );
}

/* ---------- Public link ---------- */
export function PublicLink({ persona, types, onPickType }: { persona: Persona; types: RequestTypeConfig[]; onPickType: (t: RequestTypeConfig) => void }) {
  return (
    <div className="public-page" style={{ padding: '25px' }}>
      <div className="public-shell">
        <div className="public-card">
          <div className="public-banner" />
          <div className="public-head">
            <div className="public-avatar">{persona.avatar.initials}</div>
            <div className="public-ident">
              <div className="public-name">
                {persona.name}
                {persona.verified && <Icon name="verified" size={18} className="public-verified ic" />}
              </div>
              <div className="public-role">{persona.role}</div>
              <div className="public-handle">getintro.to/{persona.handle}</div>
            </div>
            <button className="btn sm"><Icon name="external" size={12} className="ic-sm" />Share</button>
          </div>
          <div className="public-stats">
            <div><div className="public-stat-v">{persona.stats.replies}</div><div className="public-stat-l">reply rate</div></div>
            <div><div className="public-stat-v">{persona.stats.turnaround}</div><div className="public-stat-l">avg turnaround</div></div>
            <div><div className="public-stat-v">{persona.stats.sent}</div><div className="public-stat-l">requests handled</div></div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="dot ok" /><span className="mono tiny">accepting requests</span>
            </div>
          </div>
          <div className="public-bio">{persona.bio}</div>
          <div className="request-menu">
            <div className="menu-h">— pick a request type —</div>
            {types.map(t => (
              <div key={t.id} className="request-type-row" onClick={() => onPickType(t)}>
                <div className="request-type-icon">{t.icon}</div>
                <div>
                  <div className="request-type-name">{t.name}</div>
                  <div className="request-type-desc">{t.desc}</div>
                </div>
                <div className={`request-type-price ${t.free ? 'free' : ''}`}>{t.price}</div>
                <div className="request-type-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--fg-mute)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
          ✦ Powered by Get Intro · Smart networking OS
        </div>
      </div>
    </div>
  );
}

/* ---------- Submit form ---------- */
export function SubmitForm({ type, persona, onBack }: { type: RequestTypeConfig; persona: Persona; onBack: () => void }) {
  const [step, setStep] = useState<'form' | 'sent'>('form');
  const [msg, setMsg] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [urg, setUrg] = useState('normal');
  const [focusField, setFocusField] = useState('');

  const handleSend = async () => {
    await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, role, message: msg, typeId: type.id, typeName: type.name, urgency: urg }),
    });
    setStep('sent');
  };

  if (step === 'sent') {
    return (
      <div className="form-shell">
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--accent-soft)', display: 'grid', placeItems: 'center', margin: '0 auto 24px', border: '1px solid var(--accent)' }}>
            <Icon name="check" size={32} style={{ color: 'var(--accent)' }} />
          </div>
          <div className="form-title" style={{ textAlign: 'center' }}>Request sent.</div>
          <div className="form-sub" style={{ textAlign: 'center', margin: '12px auto 24px', maxWidth: 380 }}>
            {persona.name} usually replies in <strong className="mono">{persona.stats.turnaround}</strong>. You'll get an email either way.
          </div>
          <button className="btn lg" onClick={onBack}>Back to profile</button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-shell">
      <div className="form-head">
        <span className="form-backlink" onClick={onBack}><Icon name="arrowLeft" size={12} className="ic-sm" /> back to {persona.name.split(' ')[0]}'s link</span>
      </div>
      <div>
        <div className="form-title">{type.name}</div>
        <div className="form-sub">{type.desc} · <span className="mono" style={{ color: 'var(--fg)' }}>{type.price}</span></div>
      </div>
      {[
        { key: 'name', label: 'You', placeholder: 'Full name', val: name, set: setName },
        { key: 'role', label: 'Role / company', placeholder: 'Co-founder, Harbor', val: role, set: setRole },
      ].map(f => (
        <div key={f.key} className="field">
          <div className="field-label">{f.label} <span className="field-label-required">*</span></div>
          <div className={`field-input ${focusField === f.key ? 'focused' : ''}`}>
            <input placeholder={f.placeholder} value={f.val} onChange={e => f.set(e.target.value)} onFocus={() => setFocusField(f.key)} onBlur={() => setFocusField('')} />
          </div>
        </div>
      ))}
      <div className="field">
        <div className="field-label">Your ask <span className="field-label-required">*</span></div>
        <div className="field-help">Be specific. Fuzzy asks get fuzzy replies.</div>
        <div className={`field-input ${focusField === 'msg' ? 'focused' : ''}`}>
          <textarea placeholder="Share context, numbers, and what a good reply looks like." value={msg} onChange={e => setMsg(e.target.value)} onFocus={() => setFocusField('msg')} onBlur={() => setFocusField('')} />
        </div>
      </div>
      <div className="field">
        <div className="field-label">Urgency</div>
        <div className="radio-grid">
          {[['low', 'Whenever', '2 wks ok'], ['normal', 'Normal', 'a few days'], ['high', 'Timely', 'by EoW']].map(([v, t, s]) => (
            <button key={v} className={`radio-card ${urg === v ? 'active' : ''}`} onClick={() => setUrg(v)}>
              <div className="radio-card-title">{t}</div><div className="radio-card-sub">{s}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="card" style={{ padding: 'var(--pad-3)', display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--bg-1)' }}>
        <Icon name="spark" size={16} className="ic" style={{ color: 'var(--accent)', marginTop: 2 }} />
        <div>
          <div style={{ fontSize: 12 }}>Get Intro will auto-match you to similar people {persona.name.split(' ')[0]} has recently introduced.</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 12, color: 'var(--fg-dim)', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked /> Allow automatic re-routing
          </label>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
        <button className="btn ghost" onClick={onBack}>Cancel</button>
        <div style={{ flex: 1 }} />
        <div className="mono tiny mute" style={{ alignSelf: 'center', marginRight: 8 }}>{type.price}</div>
        <button className="btn primary lg" onClick={handleSend}><Icon name="send" size={14} className="ic-sm" />Send request</button>
      </div>
    </div>
  );
}
