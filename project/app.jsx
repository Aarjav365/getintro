// Main App + Tweaks panel + routing
function App() {
  // persisted state
  const [route, setRoute] = useState(() => localStorage.getItem('gi.route') || 'inbox');
  const [personaKey, setPersonaKeyState] = useState(() => localStorage.getItem('gi.persona') || 'maya');
  const [inboxVariant, setInboxVariant] = useState(() => localStorage.getItem('gi.inboxVariant') || 'list');
  const [accent, setAccent] = useState(() => localStorage.getItem('gi.accent') || 'lime');
  const [theme, setTheme] = useState(() => localStorage.getItem('gi.theme') || 'dark');
  const [density, setDensity] = useState(() => localStorage.getItem('gi.density') || 'comfortable');
  const [typeface, setTypeface] = useState(() => localStorage.getItem('gi.typeface') || 'geist');
  const [aiMode, setAiMode] = useState(() => localStorage.getItem('gi.aiMode') || 'subtle');
  const [viewport, setViewport] = useState(() => localStorage.getItem('gi.viewport') || 'desktop');
  const [selectedType, setSelectedType] = useState(null);
  const [showTweaks, setShowTweaks] = useState(false);
  const [showOnb, setShowOnb] = useState(() => localStorage.getItem('gi.onbDone') !== '1');

  // apply to root
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('gi.theme', theme); }, [theme]);
  useEffect(() => { document.documentElement.setAttribute('data-density', density); localStorage.setItem('gi.density', density); }, [density]);
  useEffect(() => { document.documentElement.setAttribute('data-typeface', typeface); localStorage.setItem('gi.typeface', typeface); }, [typeface]);
  useEffect(() => { document.documentElement.setAttribute('data-ai-mode', aiMode); localStorage.setItem('gi.aiMode', aiMode); }, [aiMode]);
  useEffect(() => { localStorage.setItem('gi.route', route); }, [route]);
  useEffect(() => { localStorage.setItem('gi.persona', personaKey); }, [personaKey]);
  useEffect(() => { localStorage.setItem('gi.inboxVariant', inboxVariant); }, [inboxVariant]);
  useEffect(() => { localStorage.setItem('gi.viewport', viewport); }, [viewport]);

  // accent color via CSS var
  useEffect(() => {
    const map = {
      lime:   { a: '#b8ff3a', ink: '#0a0a0a', glow: 'rgba(184,255,58,0.18)', soft: 'rgba(184,255,58,0.10)' },
      orange: { a: '#ff8a3a', ink: '#0a0a0a', glow: 'rgba(255,138,58,0.22)', soft: 'rgba(255,138,58,0.12)' },
      blue:   { a: '#6aa5ff', ink: '#0a0a0a', glow: 'rgba(106,165,255,0.22)', soft: 'rgba(106,165,255,0.12)' },
      violet: { a: '#c28aff', ink: '#0a0a0a', glow: 'rgba(194,138,255,0.22)', soft: 'rgba(194,138,255,0.12)' },
      coral:  { a: '#ff7373', ink: '#0a0a0a', glow: 'rgba(255,115,115,0.22)', soft: 'rgba(255,115,115,0.12)' },
      cream:  { a: '#ece9e0', ink: '#0a0a0a', glow: 'rgba(236,233,224,0.20)', soft: 'rgba(236,233,224,0.10)' },
    }[accent] || {};
    const r = document.documentElement;
    r.style.setProperty('--accent', map.a);
    r.style.setProperty('--accent-ink', map.ink);
    r.style.setProperty('--accent-glow', map.glow);
    r.style.setProperty('--accent-soft', map.soft);
    localStorage.setItem('gi.accent', accent);
  }, [accent]);

  // Tweaks protocol
  useEffect(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode') setShowTweaks(true);
      if (d.type === '__deactivate_edit_mode') setShowTweaks(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const persona = GI_DATA.personas[personaKey] || GI_DATA.personas.maya;

  const cyclePersona = () => {
    const keys = Object.keys(GI_DATA.personas);
    const i = keys.indexOf(personaKey);
    setPersonaKeyState(keys[(i + 1) % keys.length]);
  };

  const counts = { pending: GI_DATA.requests.filter(r => r.status === 'pending').length };

  if (showOnb) {
    return <Onboarding persona={persona} onDone={() => { setShowOnb(false); localStorage.setItem('gi.onbDone','1'); setRoute('inbox'); }} />;
  }

  // public link view — no chrome
  if (route === 'public' && !selectedType) {
    return <>
      <div className="app" data-mobile={viewport === 'mobile'}>
        {viewport !== 'mobile' && <Sidebar route={route} setRoute={setRoute} persona={persona} setPersonaKey={cyclePersona} counts={counts}/>}
        <div className="main">
          <Topbar crumbs={['Your link', 'Public profile']} right={<>
            <button className="btn sm"><Icon name="external" size={12} className="ic-sm"/>Open in new tab</button>
            <button className="btn sm"><Icon name="link" size={12} className="ic-sm"/>Copy URL</button>
          </>}/>
          <div className="content scroll">
            <PublicLink persona={persona} onPickType={setSelectedType} />
          </div>
        </div>
      </div>
      {showTweaks && <TweaksPanel {...{accent, setAccent, theme, setTheme, density, setDensity, typeface, setTypeface, inboxVariant, setInboxVariant, aiMode, setAiMode, personaKey, setPersonaKey: setPersonaKeyState, viewport, setViewport, setShowOnb}} />}
      <ViewportSwitch viewport={viewport} setViewport={setViewport}/>
    </>;
  }

  if (route === 'public' && selectedType) {
    return <>
      <div className="app" data-mobile={viewport === 'mobile'}>
        {viewport !== 'mobile' && <Sidebar route={route} setRoute={setRoute} persona={persona} setPersonaKey={cyclePersona} counts={counts}/>}
        <div className="main">
          <Topbar crumbs={['Your link', 'Submit request']} />
          <div className="content scroll">
            <SubmitForm type={selectedType} persona={persona} onBack={()=>setSelectedType(null)}/>
          </div>
        </div>
      </div>
      {showTweaks && <TweaksPanel {...{accent, setAccent, theme, setTheme, density, setDensity, typeface, setTypeface, inboxVariant, setInboxVariant, aiMode, setAiMode, personaKey, setPersonaKey: setPersonaKeyState, viewport, setViewport, setShowOnb}} />}
      <ViewportSwitch viewport={viewport} setViewport={setViewport}/>
    </>;
  }

  return (
    <>
      <div className="app" data-mobile={viewport === 'mobile'}>
        {viewport !== 'mobile' && <Sidebar route={route} setRoute={setRoute} persona={persona} setPersonaKey={cyclePersona} counts={counts}/>}
        <div className="main">
          <Topbar
            onMenu={viewport==='mobile' ? () => {} : null}
            crumbs={
              route === 'inbox' ? ['Inbox', `${counts.pending} pending`] :
              route === 'matches' ? ['AI matches', 'Weekly'] :
              route === 'connector' ? ['Connector', 'Setup'] :
              route === 'types' ? ['Settings', 'Request types'] :
              route === 'community' ? ['Community', 'On Deck Fintech'] :
              ['Settings']
            }
            right={
              route === 'inbox' ? (
                <div style={{display:'flex', gap: 2, border: '1px solid var(--line)', borderRadius: 999, padding: 2, background: 'var(--bg-1)'}}>
                  <button className={`btn sm ${inboxVariant==='list'?'primary':'ghost'}`} style={{borderRadius:999}} onClick={()=>setInboxVariant('list')}>List</button>
                  <button className={`btn sm ${inboxVariant==='stack'?'primary':'ghost'}`} style={{borderRadius:999}} onClick={()=>setInboxVariant('stack')}>Triage</button>
                </div>
              ) : null
            }
          />
          <div className="content scroll">
            {route === 'inbox' && <Inbox variant={inboxVariant} persona={persona}/>}
            {route === 'matches' && <Matches/>}
            {route === 'connector' && <Connector persona={persona}/>}
            {route === 'types' && <RequestTypesSettings/>}
            {route === 'community' && <Community/>}
            {route === 'settings' && <GenericSettings/>}
          </div>
        </div>
      </div>
      {showTweaks && <TweaksPanel {...{accent, setAccent, theme, setTheme, density, setDensity, typeface, setTypeface, inboxVariant, setInboxVariant, aiMode, setAiMode, personaKey, setPersonaKey: setPersonaKeyState, viewport, setViewport, setShowOnb}} />}
      <ViewportSwitch viewport={viewport} setViewport={setViewport}/>
    </>
  );
}

function ViewportSwitch({ viewport, setViewport }) {
  return (
    <div className="viewport-mode-switch">
      <div className={`viewport-opt ${viewport==='desktop'?'active':''}`} onClick={()=>setViewport('desktop')}>desktop</div>
      <div className={`viewport-opt ${viewport==='mobile'?'active':''}`} onClick={()=>setViewport('mobile')}>mobile</div>
    </div>
  );
}

function TweaksPanel(props) {
  const { accent, setAccent, theme, setTheme, density, setDensity, typeface, setTypeface, inboxVariant, setInboxVariant, aiMode, setAiMode, personaKey, setPersonaKey, viewport, setViewport, setShowOnb } = props;
  return (
    <div className="tweaks-panel">
      <div className="tweaks-head">
        <div className="tweaks-head-title">Tweaks</div>
        <div style={{marginLeft:'auto'}} className="mono tiny mute">live</div>
      </div>
      <div className="tweaks-body scroll">
        <TweakRow label="Accent">
          <div className="tweak-options">
            {[
              ['lime','#b8ff3a'],['orange','#ff8a3a'],['blue','#6aa5ff'],
              ['violet','#c28aff'],['coral','#ff7373'],['cream','#ece9e0']
            ].map(([k, c]) => (
              <div key={k} className={`tweak-swatch ${accent===k?'active':''}`} style={{background:c}} onClick={()=>setAccent(k)}/>
            ))}
          </div>
        </TweakRow>
        <TweakRow label="Theme">
          <div className="tweak-options">
            {['dark','light'].map(t => (
              <div key={t} className={`tweak-opt ${theme===t?'active':''}`} onClick={()=>setTheme(t)}>{t}</div>
            ))}
          </div>
        </TweakRow>
        <TweakRow label="Density">
          <div className="tweak-options">
            {['comfortable','compact'].map(t => (
              <div key={t} className={`tweak-opt ${density===t?'active':''}`} onClick={()=>setDensity(t)}>{t}</div>
            ))}
          </div>
        </TweakRow>
        <TweakRow label="Typeface">
          <div className="tweak-options">
            {[['geist','Geist'],['inter','Inter'],['serif','Serif display']].map(([k,l]) => (
              <div key={k} className={`tweak-opt ${typeface===k?'active':''}`} onClick={()=>setTypeface(k)}>{l}</div>
            ))}
          </div>
        </TweakRow>
        <TweakRow label="Inbox layout">
          <div className="tweak-options">
            {[['list','List + detail'],['stack','Triage deck']].map(([k,l]) => (
              <div key={k} className={`tweak-opt ${inboxVariant===k?'active':''}`} onClick={()=>setInboxVariant(k)}>{l}</div>
            ))}
          </div>
        </TweakRow>
        <TweakRow label="AI panel style">
          <div className="tweak-options">
            {[['subtle','Subtle'],['visible','Visible'],['hidden','Hidden']].map(([k,l]) => (
              <div key={k} className={`tweak-opt ${aiMode===k?'active':''}`} onClick={()=>setAiMode(k)}>{l}</div>
            ))}
          </div>
        </TweakRow>
        <TweakRow label="Persona">
          <div className="tweak-options">
            {Object.entries(GI_DATA.personas).map(([k, p]) => (
              <div key={k} className={`tweak-opt ${personaKey===k?'active':''}`} onClick={()=>setPersonaKey(k)}>{p.name.split(' ')[0]}</div>
            ))}
          </div>
        </TweakRow>
        <TweakRow label="Viewport">
          <div className="tweak-options">
            {['desktop','mobile'].map(v => (
              <div key={v} className={`tweak-opt ${viewport===v?'active':''}`} onClick={()=>setViewport(v)}>{v}</div>
            ))}
          </div>
        </TweakRow>
        <div style={{borderTop:'1px solid var(--line)', paddingTop: 10}}>
          <button className="btn sm" style={{width:'100%', justifyContent:'center'}} onClick={()=>{localStorage.removeItem('gi.onbDone'); setShowOnb(true);}}>Replay onboarding</button>
        </div>
      </div>
    </div>
  );
}

function TweakRow({ label, children }) {
  return (
    <div className="tweak-row">
      <div className="tweak-label">{label}</div>
      {children}
    </div>
  );
}

/* settings placeholders */
function RequestTypesSettings() {
  return (
    <div className="connector-wrap">
      <div className="hero-head">
        <div>
          <h1 className="hero-title">Request types</h1>
          <div className="hero-sub">Customise the menu on your public link. Each type gets its own price, form, and auto-reply policy.</div>
        </div>
        <button className="btn primary"><Icon name="plus" size={14} className="ic-sm"/>New type</button>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'1fr', gap: 8}}>
        {GI_DATA.requestTypes.map(t => (
          <div key={t.id} className="card" style={{padding: 'var(--pad-4)', display:'flex', gap: 14, alignItems:'center'}}>
            <div className="request-type-icon" style={{width: 44, height: 44}}>{t.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontSize: 15, fontWeight: 500}}>{t.name}</div>
              <div className="tiny mute">{t.desc}</div>
              <div style={{display:'flex', gap: 6, marginTop: 6, flexWrap:'wrap'}}>
                {t.fields.map(f => <span key={f} className="chip mono tiny">{f}</span>)}
              </div>
            </div>
            <div className={`request-type-price ${t.free ? 'free' : ''}`}>{t.price}</div>
            <Toggle defaultOn={true}/>
            <button className="btn sm"><Icon name="cog" size={14} className="ic-sm"/>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenericSettings() {
  return <div className="connector-wrap"><div className="hero-head"><div><h1 className="hero-title">Settings</h1><div className="hero-sub">Privacy, billing, integrations.</div></div></div></div>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
