// Inbox — two variants: list and deck
function Inbox({ variant, persona }) {
  const [selected, setSelected] = useState('r1');
  const [filter, setFilter] = useState('all');
  const [detailOpen, setDetailOpen] = useState(true);
  const all = GI_DATA.requests;

  const filtered = useMemo(() => {
    if (filter === 'all') return all;
    if (filter === 'pending') return all.filter(r => r.status === 'pending');
    if (filter === 'invest') return all.filter(r => r.type === 'invest');
    if (filter === 'accepted') return all.filter(r => r.status === 'accepted');
    if (filter === 'unread') return all.filter(r => r.unread);
    return all;
  }, [filter, all]);

  const current = all.find(r => r.id === selected);

  if (variant === 'stack') {
    return <DeckInbox requests={filtered.filter(r=>r.status==='pending')} persona={persona} />;
  }

  return (
    <div className="inbox-shell" data-variant="list" data-detail={detailOpen ? 'open' : 'closed'}>
      <div className="inbox-list-pane">
        <div className="inbox-filterbar">
          <FilterPill label="All" count={all.length} active={filter==='all'} onClick={()=>setFilter('all')} />
          <FilterPill label="Unread" count={all.filter(r=>r.unread).length} active={filter==='unread'} onClick={()=>setFilter('unread')} />
          <FilterPill label="Pending" count={all.filter(r=>r.status==='pending').length} active={filter==='pending'} onClick={()=>setFilter('pending')} />
          <FilterPill label="Pitches" count={all.filter(r=>r.type==='invest').length} active={filter==='invest'} onClick={()=>setFilter('invest')} />
          <FilterPill label="Accepted" count={all.filter(r=>r.status==='accepted').length} active={filter==='accepted'} onClick={()=>setFilter('accepted')} />
        </div>
        <div className="inbox-list scroll">
          {filtered.map(r => (
            <div key={r.id} className={`req-row ${r.unread ? 'unread' : ''} ${r.id === selected ? 'selected' : ''}`} onClick={() => { setSelected(r.id); setDetailOpen(true); }}>
              <Avatar p={r.sender.avatar} size="md" />
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
      {detailOpen && current && <RequestDetail r={current} onClose={() => setDetailOpen(false)} />}
    </div>
  );
}

function FilterPill({ label, count, active, onClick }) {
  return (
    <div className={`filter-pill ${active ? 'active' : ''}`} onClick={onClick}>
      {label}
      <span className="filter-pill-count">{count}</span>
    </div>
  );
}

function StatusChip({ status }) {
  if (status === 'accepted') return <span className="chip ok"><span className="dot ok"/>accepted</span>;
  if (status === 'declined') return <span className="chip bad"><span className="dot bad"/>declined</span>;
  if (status === 'pending') return <span className="chip warn"><span className="dot warn"/>pending</span>;
  return <span className="chip"><span className="dot mute"/>{status}</span>;
}

/* ---------- Deck variant ---------- */
function DeckInbox({ requests, persona }) {
  const [idx, setIdx] = useState(0);
  const [gone, setGone] = useState({}); // id -> 'left'|'right'

  const visible = requests.filter(r => !gone[r.id]);
  const front = visible[0];
  const back1 = visible[1];
  const back2 = visible[2];

  const swipe = (dir) => {
    if (!front) return;
    setGone({ ...gone, [front.id]: dir });
  };

  const remaining = visible.length;

  return (
    <div className="deck-shell">
      <div className="deck-head">
        <div>
          <h2>Morning triage <em>{remaining}</em></h2>
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
          <button className="deck-action-btn decline" onClick={() => swipe('left')} title="Decline"><Icon name="x" size={24} /></button>
          <div className="deck-action-hint">← decline</div>
        </div>
        <div className="deck-center">
          {requests.map((r, i) => {
            const g = gone[r.id];
            if (g) return <DeckCard key={r.id} r={r} pos={`gone-${g}`} />;
            if (r === front) return <DeckCard key={r.id} r={r} pos="front" />;
            if (r === back1) return <DeckCard key={r.id} r={r} pos="back1" />;
            if (r === back2) return <DeckCard key={r.id} r={r} pos="back2" />;
            return null;
          })}
          {!front && <div className="deck-card" data-pos="front" style={{display:'grid',placeItems:'center',textAlign:'center'}}>
            <div>
              <div style={{fontSize: 32, marginBottom: 12}}>⌁</div>
              <div style={{fontFamily:'var(--font-display)', fontSize: 22}}>Inbox zero.</div>
              <div className="mute" style={{marginTop: 6}}>38 minutes under your daily budget.</div>
            </div>
          </div>}
          <div className="deck-queue">
            {requests.map(r => (
              <span key={r.id} className={`deck-queue-dot ${r === front ? 'active' : ''}`} />
            ))}
          </div>
        </div>
        <div className="deck-actions-right">
          <button className="deck-action-btn accept" onClick={() => swipe('right')} title="Accept & reply"><Icon name="check" size={24} /></button>
          <div className="deck-action-hint">accept →</div>
        </div>
      </div>
    </div>
  );
}

function DeckCard({ r, pos }) {
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
        {Object.entries(r.fields || {}).slice(0,4).map(([k,v]) => (
          <div key={k} className="deck-card-field">
            <div className="deck-card-field-l">{k}</div>
            <div className="deck-card-field-v">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.Inbox = Inbox;
