'use client';
import { useState, useMemo } from 'react';
import type { Request, RequestStatus } from '@/lib/types';
import { Avatar } from './Shell';
import { Icon } from './Icons';

interface InboxProps {
  variant: 'list' | 'stack';
  requests: Request[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUpdateRequest: (id: string, updates: Partial<Request>) => void;
}

export function Inbox({ variant, requests, selectedId, onSelect, onUpdateRequest }: InboxProps) {
  const [filter, setFilter] = useState<string>('all');
  const [detailOpen, setDetailOpen] = useState(true);

  const filtered = useMemo(() => {
    if (filter === 'all') return requests;
    if (filter === 'pending') return requests.filter(r => r.status === 'pending');
    if (filter === 'invest') return requests.filter(r => r.type === 'invest');
    if (filter === 'accepted') return requests.filter(r => r.status === 'accepted');
    if (filter === 'unread') return requests.filter(r => r.unread);
    return requests;
  }, [filter, requests]);

  const current = requests.find(r => r.id === selectedId);

  if (variant === 'stack') {
    return <DeckInbox requests={filtered.filter(r => r.status === 'pending')} onUpdateRequest={onUpdateRequest} />;
  }

  return (
    <div className="inbox-shell" data-variant="list" data-detail={detailOpen && current ? 'open' : 'closed'}>
      <div className="inbox-list-pane">
        <div className="inbox-filterbar">
          {[
            { label: 'All', key: 'all', count: requests.length },
            { label: 'Unread', key: 'unread', count: requests.filter(r => r.unread).length },
            { label: 'Pending', key: 'pending', count: requests.filter(r => r.status === 'pending').length },
            { label: 'Pitches', key: 'invest', count: requests.filter(r => r.type === 'invest').length },
            { label: 'Accepted', key: 'accepted', count: requests.filter(r => r.status === 'accepted').length },
          ].map(f => (
            <div key={f.key} className={`filter-pill ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
              {f.label}<span className="filter-pill-count">{f.count}</span>
            </div>
          ))}
        </div>
        <div className="inbox-list scroll">
          {filtered.map(r => (
            <div
              key={r.id}
              className={`req-row ${r.unread ? 'unread' : ''} ${r.id === selectedId ? 'selected' : ''}`}
              onClick={() => { onSelect(r.id); setDetailOpen(true); }}
            >
              <Avatar p={r.sender.avatar} />
              <div className="req-body">
                <div className="req-head">
                  <span className="req-from">{r.sender.name}</span>
                  <span className="req-meta"><span className="req-type-badge">{r.typeLabel}</span></span>
                </div>
                <div className="req-subject">{r.subject}</div>
                <div className="req-preview">{r.preview}</div>
              </div>
              <div className="req-meta-col">
                <span>{r.time}</span>
                <StatusChip status={r.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {detailOpen && current && (
        <RequestDetail r={current} onClose={() => setDetailOpen(false)} onUpdateRequest={onUpdateRequest} />
      )}
    </div>
  );
}

export function StatusChip({ status }: { status: RequestStatus | string }) {
  if (status === 'accepted') return <span className="chip ok"><span className="dot ok" />accepted</span>;
  if (status === 'declined') return <span className="chip bad"><span className="dot bad" />declined</span>;
  if (status === 'pending') return <span className="chip warn"><span className="dot warn" />pending</span>;
  return <span className="chip"><span className="dot mute" />{status}</span>;
}

/* ---------- Deck variant ---------- */
function DeckInbox({ requests, onUpdateRequest }: { requests: Request[]; onUpdateRequest: (id: string, u: Partial<Request>) => void }) {
  const [gone, setGone] = useState<Record<string, 'left' | 'right'>>({});

  const visible = requests.filter(r => !gone[r.id]);
  const front = visible[0];
  const back1 = visible[1];
  const back2 = visible[2];

  const swipe = (dir: 'left' | 'right') => {
    if (!front) return;
    setGone(g => ({ ...g, [front.id]: dir }));
    if (dir === 'right') onUpdateRequest(front.id, { status: 'accepted', unread: false });
    else onUpdateRequest(front.id, { status: 'declined' });
  };

  return (
    <div className="deck-shell">
      <div className="deck-head">
        <div>
          <h2>Morning triage <em>{visible.length}</em></h2>
          <div className="deck-sub">Swipe through pending requests. Everything decided in 6 minutes today.</div>
        </div>
        <div className="deck-stats">
          <div className="deck-stat"><div className="deck-stat-v accent">14</div><div className="deck-stat-l">accepted this wk</div></div>
          <div className="deck-stat"><div className="deck-stat-v">36h</div><div className="deck-stat-l">avg reply</div></div>
          <div className="deck-stat"><div className="deck-stat-v">94%</div><div className="deck-stat-l">reply rate</div></div>
        </div>
      </div>
      <div className="deck-stage">
        <div className="deck-actions-left">
          <button className="deck-action-btn decline" onClick={() => swipe('left')}><Icon name="x" size={24} /></button>
          <div className="deck-action-hint">← decline</div>
        </div>
        <div className="deck-center">
          {requests.map(r => {
            const g = gone[r.id];
            if (g) return <DeckCard key={r.id} r={r} pos={`gone-${g}`} />;
            if (r === front) return <DeckCard key={r.id} r={r} pos="front" />;
            if (r === back1) return <DeckCard key={r.id} r={r} pos="back1" />;
            if (r === back2) return <DeckCard key={r.id} r={r} pos="back2" />;
            return null;
          })}
          {!front && (
            <div className="deck-card" data-pos="front" style={{ display: 'grid', placeItems: 'center', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: 32, marginBottom: 12 }}>⌁</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>Inbox zero.</div>
                <div className="mute" style={{ marginTop: 6 }}>38 minutes under your daily budget.</div>
              </div>
            </div>
          )}
          <div className="deck-queue">
            {requests.map(r => <span key={r.id} className={`deck-queue-dot ${r === front ? 'active' : ''}`} />)}
          </div>
        </div>
        <div className="deck-actions-right">
          <button className="deck-action-btn accept" onClick={() => swipe('right')}><Icon name="check" size={24} /></button>
          <div className="deck-action-hint">accept →</div>
        </div>
      </div>
    </div>
  );
}

function DeckCard({ r, pos }: { r: Request; pos: string }) {
  return (
    <div className="deck-card" data-pos={pos}>
      <div className="deck-card-head">
        <Avatar p={r.sender.avatar} size="lg" />
        <div className="meta">
          <div className="deck-card-name">{r.sender.name}</div>
          <div className="deck-card-title">{r.sender.role}</div>
        </div>
        <div className="deck-card-type">{r.typeLabel}</div>
      </div>
      <div className="deck-card-subject">{r.subject}</div>
      <div className="deck-card-body">{r.preview}</div>
      <div className="deck-card-fields">
        {Object.entries(r.fields || {}).slice(0, 4).map(([k, v]) => (
          <div key={k} className="deck-card-field">
            <div className="deck-card-field-l">{k}</div>
            <div className="deck-card-field-v">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Request detail ---------- */
interface RequestDetailProps {
  r: Request;
  onClose: () => void;
  onUpdateRequest: (id: string, updates: Partial<Request>) => void;
}

export function RequestDetail({ r, onClose, onUpdateRequest }: RequestDetailProps) {
  const [replyText, setReplyText] = useState(r.ai?.draftReply || '');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiVisible, setAiVisible] = useState(true);
  const [sent, setSent] = useState(false);

  const handleAccept = async () => {
    await fetch(`/api/requests/${r.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'accepted', unread: false }),
    });
    onUpdateRequest(r.id, { status: 'accepted', unread: false });
  };

  const handleDecline = async () => {
    await fetch(`/api/requests/${r.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'declined' }),
    });
    onUpdateRequest(r.id, { status: 'declined' });
  };

  const streamDraft = async (tone: string) => {
    setAiLoading(true);
    setReplyText('');
    const res = await fetch(`/api/requests/${r.id}/ai-reply?tone=${tone}`);
    const reader = res.body?.getReader();
    if (!reader) { setAiLoading(false); return; }
    const dec = new TextDecoder();
    let buf = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const lines = dec.decode(value).split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const d = JSON.parse(line.slice(6));
            if (d.type === 'char') setReplyText(t => t + d.char);
            if (d.type === 'done') { buf = ''; setAiLoading(false); }
          } catch { /* ignore */ }
        }
      }
    }
    setAiLoading(false);
  };

  const emailTo = `${r.sender.name.toLowerCase().replace(/\s+/g, '.')}@${(r.sender.company || 'example').toLowerCase()}.com`;

  return (
    <div className="detail-pane">
      <div className="detail-head">
        <button className="btn ghost sm" onClick={onClose}><Icon name="arrowLeft" size={14} className="ic-sm" /> Back</button>
        <StatusChip status={r.status} />
        <span className="chip"><Icon name="clock" size={12} className="ic-sm" />{r.date}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <button className="btn sm ghost"><Icon name="archive" size={14} className="ic-sm" /> Archive</button>
          <button className="btn sm ghost"><Icon name="flag" size={14} className="ic-sm" /> Flag</button>
          <button className="btn sm"><Icon name="dots" size={14} className="ic-sm" /></button>
        </div>
      </div>
      <div className="detail-body scroll">
        <div className="detail-sender">
          <Avatar p={r.sender.avatar} size="xl" />
          <div className="detail-sender-info">
            <div className="detail-sender-name">{r.sender.name}</div>
            <div className="detail-sender-sub">{r.sender.role}{r.sender.location ? ` · ${r.sender.location}` : ''}</div>
            <div className="detail-sender-links">
              {r.sender.links?.map(l => (
                <span key={l.k} className="chip"><Icon name="external" size={11} className="ic-sm" />{l.v}</span>
              ))}
              <span className="chip"><Icon name="at" size={11} className="ic-sm" />{r.typeLabel}</span>
            </div>
          </div>
          {r.status === 'pending' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button className="btn primary sm" onClick={handleAccept}><Icon name="check" size={14} className="ic-sm" />Accept</button>
              <button className="btn sm" onClick={handleDecline}>Decline</button>
            </div>
          )}
        </div>

        <div>
          <div className="detail-section-h">Subject</div>
          <div className="detail-subject">{r.subject}</div>
        </div>

        {r.message && (
          <div>
            <div className="detail-section-h">Message</div>
            <div className="detail-msg">
              {r.message.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        )}

        {r.fields && Object.keys(r.fields).length > 0 && (
          <div>
            <div className="detail-section-h">Intake fields</div>
            <div className="field-grid">
              {Object.entries(r.fields).map(([k, v]) => (
                <div key={k} className="field-card">
                  <div className="field-card-l">{k}</div>
                  <div className="field-card-v">{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {r.ai && aiVisible && (
          <div className="ai-panel">
            <div className="ai-panel-head">
              <Icon name="spark" size={16} className="ai-spark" />
              <div className="ai-panel-title">
                Fit analysis
                <span className="chip accent mono" style={{ marginLeft: 8 }}>{r.ai.fit}% fit</span>
              </div>
              <div style={{ marginLeft: 'auto' }} className="mono tiny mute">trained on your accept/decline history</div>
            </div>
            <div className="ai-panel-body">
              {r.ai.reasons.map((re, i) => (
                <div key={i} className="ai-reason-row">
                  <div className="ai-reason-label">{re.k}</div>
                  <div className="ai-reason-value" dangerouslySetInnerHTML={{ __html: re.v }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {r.status === 'pending' && (
          <div className="composer">
            <div className="composer-head">
              <span className="mono mute">to: {emailTo}</span>
              <span style={{ marginLeft: 'auto' }} className="chip">Reply · plain</span>
            </div>
            <div className="composer-body">
              <textarea
                placeholder={r.ai?.draftReply ? '' : 'Write your reply…'}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                style={{ opacity: aiLoading ? 0.6 : 1 }}
              />
            </div>
            {r.ai && (
              <div className="composer-ai-strip">
                <span className="mono tiny mute">✦ suggest:</span>
                <button className="ai-chip" onClick={() => streamDraft('draft')}><Icon name="spark" size={12} className="ic-sm" />Use draft</button>
                <button className="ai-chip" onClick={() => streamDraft('warmer')}>Warmer</button>
                <button className="ai-chip" onClick={() => streamDraft('shorter')}>Shorter</button>
                <button className="ai-chip" onClick={() => streamDraft('deck')}>Ask for deck</button>
                <button className="ai-chip" onClick={() => streamDraft('time')}>Propose time</button>
              </div>
            )}
            <div className="composer-foot">
              <button className="btn sm"><Icon name="calendar" size={14} className="ic-sm" />Attach calendar</button>
              <button className="btn sm"><Icon name="link" size={14} className="ic-sm" />Link</button>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                <button className="btn sm ghost">Save draft</button>
                <button className="btn primary sm" onClick={() => { setSent(true); handleAccept(); }}>
                  <Icon name="send" size={14} className="ic-sm" />{sent ? 'Sent!' : 'Send reply'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
