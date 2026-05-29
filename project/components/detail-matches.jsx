// Request detail + reply composer, and matches (constellation) and intro draft
function RequestDetail({ r, onClose }) {
  const [replyText, setReplyText] = useState('');
  const [aiMode, setAiMode] = useState('subtle'); // subtle | visible | hero
  useEffect(() => {
    // load from doc panel style
    const m = document.documentElement.getAttribute('data-ai-mode');
    if (m) setAiMode(m);
    const obs = new MutationObserver(() => {
      const n = document.documentElement.getAttribute('data-ai-mode');
      if (n) setAiMode(n);
    });
    obs.observe(document.documentElement, { attributes: true });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="detail-pane">
      <div className="detail-head">
        <button className="btn ghost sm" onClick={onClose}><Icon name="arrowLeft" size={14} className="ic-sm"/> Back</button>
        <StatusChip status={r.status} />
        <span className="chip"><Icon name="clock" size={12} className="ic-sm"/>{r.date}</span>
        <div style={{marginLeft:'auto', display:'flex', gap: 6}}>
          <button className="btn sm ghost"><Icon name="archive" size={14} className="ic-sm"/> Archive</button>
          <button className="btn sm ghost"><Icon name="flag" size={14} className="ic-sm"/> Flag</button>
          <button className="btn sm"><Icon name="dots" size={14} className="ic-sm"/></button>
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
                <span key={l.k} className="chip"><Icon name="external" size={11} className="ic-sm"/>{l.v}</span>
              ))}
              <span className="chip"><Icon name="at" size={11} className="ic-sm"/>{r.typeLabel}</span>
            </div>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:6}}>
            <button className="btn primary sm"><Icon name="check" size={14} className="ic-sm"/>Accept</button>
            <button className="btn sm">Decline</button>
          </div>
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
              {Object.entries(r.fields).map(([k,v]) => (
                <div key={k} className="field-card">
                  <div className="field-card-l">{k}</div>
                  <div className="field-card-v">{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {r.ai && aiMode !== 'hidden' && (
          <div className="ai-panel">
            <div className="ai-panel-head">
              <Icon name="spark" size={16} className="ai-spark"/>
              <div className="ai-panel-title">Fit analysis <span className="chip accent mono" style={{marginLeft:8}}>{r.ai.fit}% fit</span></div>
              <div style={{marginLeft:'auto'}} className="mono tiny mute">trained on your accept/decline history</div>
            </div>
            <div className="ai-panel-body">
              {r.ai.reasons.map((re, i) => (
                <div key={i} className="ai-reason-row">
                  <div className="ai-reason-label">{re.k}</div>
                  <div className="ai-reason-value" dangerouslySetInnerHTML={{__html: re.v}} />
                </div>
              ))}
            </div>
          </div>
        )}

        {r.status === 'pending' && (
          <div className="composer">
            <div className="composer-head">
              <span className="mono mute">to: {r.sender.name.toLowerCase().replace(' ','.')}@{(r.sender.company || 'example').toLowerCase()}.com</span>
              <span style={{marginLeft:'auto'}} className="chip">Reply · plain</span>
            </div>
            <div className="composer-body">
              <textarea
                placeholder={r.ai?.draftReply ? '' : 'Write your reply…'}
                value={replyText || (r.ai?.draftReply || '')}
                onChange={e => setReplyText(e.target.value)}
              />
            </div>
            {r.ai && (
              <div className="composer-ai-strip">
                <span className="mono tiny mute">✦ suggest:</span>
                <button className="ai-chip" onClick={() => setReplyText(r.ai.draftReply)}><Icon name="spark" size={12} className="ic-sm"/>Use draft</button>
                <button className="ai-chip">Warmer</button>
                <button className="ai-chip">Shorter</button>
                <button className="ai-chip">Ask for deck</button>
                <button className="ai-chip">Propose time</button>
              </div>
            )}
            <div className="composer-foot">
              <button className="btn sm"><Icon name="calendar" size={14} className="ic-sm"/>Attach calendar</button>
              <button className="btn sm"><Icon name="link" size={14} className="ic-sm"/>Link</button>
              <div style={{marginLeft:'auto', display:'flex', gap: 6}}>
                <button className="btn sm ghost">Save draft</button>
                <button className="btn primary sm"><Icon name="send" size={14} className="ic-sm"/>Send reply</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Constellation matches ---------- */
function Matches() {
  const nodes = GI_DATA.network;
  const [activeId, setActiveId] = useState('n1');
  const active = nodes.find(n => n.id === activeId);
  const you = nodes.find(n => n.you);

  const pct = active?.score || 0;

  return (
    <div className="constellation-shell">
      <div className="constellation-stage">
        <div className="constellation-head">
          <div>
            <div className="constellation-title">5 new matches for you</div>
            <div className="constellation-sub">based on your thesis, last 30 accepts, and 2nd-degree graph</div>
          </div>
          <div style={{display:'flex', gap:6}}>
            <button className="btn sm"><Icon name="refresh" size={14} className="ic-sm"/>Refresh</button>
            <button className="btn sm"><Icon name="filter" size={14} className="ic-sm"/>Filters</button>
          </div>
        </div>

        <svg className="constellation-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          {nodes.filter(n => !n.you).map(n => {
            const a = Math.max(0.08, (n.score || 0) / 100 * 0.8);
            const active = n.id === activeId;
            return (
              <line key={n.id} x1={you.x} y1={you.y} x2={n.x} y2={n.y}
                stroke={active ? 'var(--accent)' : 'currentColor'}
                strokeOpacity={active ? 0.9 : a * 0.3}
                strokeWidth={active ? 0.3 : 0.15}
                strokeDasharray={active ? '0' : '0.4 0.4'}
                style={{ color: 'var(--fg-dim)' }}
              />
            );
          })}
        </svg>

        {nodes.map(n => (
          <div key={n.id}
               className={`node ${n.you ? 'you' : ''} ${n.id === activeId ? 'active' : ''}`}
               style={{ left: `${n.x}%`, top: `${n.y}%` }}
               onClick={() => !n.you && setActiveId(n.id)}>
            <Avatar p={{ color: n.color, initials: n.initials }} size={n.you ? 'lg' : 'md'} />
            <div className="node-label">{n.name}</div>
            {n.score && <div className="node-score">{n.score}% fit</div>}
          </div>
        ))}
      </div>

      <div className="match-panel scroll">
        {active && (
          <>
            <div className="match-card">
              <div className="match-card-head">
                <Avatar p={{ color: active.color, initials: active.initials }} size="lg" />
                <div style={{flex:1}}>
                  <div className="detail-sender-name">{active.name}</div>
                  <div className="detail-sender-sub">{active.role}</div>
                </div>
                <div className="match-score-ring" style={{['--pct']: `${pct*3.6}deg`}}>
                  <span>{pct}</span>
                </div>
              </div>
              <div className="match-card-body">
                <div className="detail-section-h">Why this match</div>
                <div style={{fontSize: 13, lineHeight: 1.55, color:'var(--fg)'}}>{active.why}</div>
                <div className="detail-section-h" style={{marginTop: 14}}>Overlap</div>
                <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
                  {active.overlap.map(t => <span key={t} className="chip accent">{t}</span>)}
                </div>
              </div>
            </div>

            <div style={{padding: 'var(--pad-5)'}}>
              <IntroDraft active={active} />
              <div style={{display:'flex', gap:6, marginTop: 14}}>
                <button className="btn primary" style={{flex:1, justifyContent:'center'}}><Icon name="send" size={14} className="ic-sm"/>Send warm intro</button>
                <button className="btn">Edit</button>
                <button className="btn ghost">Skip</button>
              </div>
              <div className="tiny mute mono" style={{marginTop: 10, textAlign:'center'}}>
                ✦ delivered via email + native message · both parties must opt-in
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function IntroDraft({ active }) {
  return (
    <div className="intro-draft">
      <div className="intro-draft-head">
        <Icon name="spark" size={12} className="ic-sm" style={{color:'var(--accent)'}}/>
        AI warm intro · draft
        <span className="intro-draft-pill">✦ personalised</span>
      </div>
      <div className="intro-lines">
        <p><strong>Subject:</strong> {active.name} ↔ Maya — <span className="hl">{active.overlap[0]}</span></p>
        <p>Hi both —</p>
        <p>
          Double opt-in intro. <strong>{active.name}</strong> ({active.role}) — meet <strong>Maya Chen</strong>, angel investor and ex-Stripe PM. You both think a lot about <span className="hl">{active.overlap[0]}</span>{active.overlap[1] ? <>and <span className="hl">{active.overlap[1]}</span></> : null}.
        </p>
        <p>
          Maya — {active.name.split(' ')[0]} is working on things that map directly to your thesis. {active.why.split('.')[0]}.
        </p>
        <p>
          {active.name.split(' ')[0]} — Maya has made <span className="hl">4 intros</span> to founders in your space this quarter and is an unusually direct operator.
        </p>
        <p>I'll let you take it from here. ✦</p>
      </div>
    </div>
  );
}

window.RequestDetail = RequestDetail;
window.Matches = Matches;
