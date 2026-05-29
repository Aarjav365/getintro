'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Shell } from './Shell';
import { Inbox } from './Inbox';
import { Matches } from './Matches';
import { ConnectorSetup, PublicLink, SubmitForm } from './ConnectorPublic';
import { Onboarding, Community, RequestTypesSettings } from './OnboardingCommunity';
import { TweaksPanel } from './TweaksPanel';
import { personas as personasMap, requestTypes } from '@/lib/data';
const personas = Object.values(personasMap);
import type { Request, RequestTypeConfig, NetworkNode, CommunityData } from '@/lib/types';

type Route = 'inbox' | 'matches' | 'connector' | 'public' | 'community' | 'types';

const LS = {
  get: (k: string, def: string) => { try { return localStorage.getItem(k) ?? def; } catch { return def; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* */ } },
};

export function App() {
  const [route, setRoute] = useState<Route>('inbox');
  const [personaIdx, setPersonaIdx] = useState(0);
  const [theme, setTheme] = useState('dark');
  const [density, setDensity] = useState('default');
  const [typeface, setTypeface] = useState('geist');
  const [inboxVariant, setInboxVariant] = useState<'list' | 'stack'>('list');
  const [aiMode, setAiMode] = useState('copilot');
  const [accent, setAccent] = useState('#b8ff3a');
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<RequestTypeConfig | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>([]);
  const [communityData, setCommunityData] = useState<CommunityData | null>(null);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const persona = personas[personaIdx];

  // Restore from localStorage
  useEffect(() => {
    setTheme(LS.get('gi-theme', 'dark'));
    setDensity(LS.get('gi-density', 'default'));
    setTypeface(LS.get('gi-typeface', 'geist'));
    setInboxVariant(LS.get('gi-inbox', 'list') as 'list' | 'stack');
    setAiMode(LS.get('gi-ai', 'copilot'));
    setAccent(LS.get('gi-accent', '#b8ff3a'));
    setPersonaIdx(parseInt(LS.get('gi-persona', '0'), 10));
    const seen = LS.get('gi-onboarding', '');
    if (!seen) setShowOnboarding(true);
  }, []);

  // Apply theme, density, typeface to document
  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute('data-theme', theme);
    el.setAttribute('data-density', density);
    el.setAttribute('data-typeface', typeface);
    el.style.setProperty('--accent', accent);
    // Derive accent ink and soft from accent
    el.style.setProperty('--accent-ink', theme === 'light' ? '#000' : '#000');
    el.style.setProperty('--accent-soft', accent + '22');
  }, [theme, density, typeface, accent]);

  // Persist settings
  const setThemeP = (v: string) => { setTheme(v); LS.set('gi-theme', v); };
  const setDensityP = (v: string) => { setDensity(v); LS.set('gi-density', v); };
  const setTypefaceP = (v: string) => { setTypeface(v); LS.set('gi-typeface', v); };
  const setInboxVariantP = (v: string) => { setInboxVariant(v as 'list' | 'stack'); LS.set('gi-inbox', v); };
  const setAiModeP = (v: string) => { setAiMode(v); LS.set('gi-ai', v); };
  const setAccentP = (v: string) => { setAccent(v); LS.set('gi-accent', v); };
  const setPersonaP = (i: number) => { setPersonaIdx(i); LS.set('gi-persona', String(i)); };

  // Fetch initial data
  useEffect(() => {
    fetch('/api/requests').then(r => r.json()).then(setRequests).catch(() => {});
    fetch('/api/network').then(r => r.json()).then(setNetworkNodes).catch(() => {});
    fetch('/api/community').then(r => r.json()).then(setCommunityData).catch(() => {});
  }, []);

  // SSE realtime connection
  useEffect(() => {
    const es = new EventSource('/api/events');
    eventSourceRef.current = es;

    es.onopen = () => setRealtimeConnected(true);
    es.onerror = () => setRealtimeConnected(false);

    es.addEventListener('message', (e) => {
      try {
        const ev = JSON.parse(e.data);
        if (ev.type === 'new_request') {
          setRequests(prev => {
            if (prev.find(r => r.id === ev.request.id)) return prev;
            const newReq = { ...ev.request, unread: true };
            return [newReq, ...prev];
          });
        }
        if (ev.type === 'update_request') {
          setRequests(prev => prev.map(r => r.id === ev.request.id ? { ...r, ...ev.request } : r));
        }
        if (ev.type === 'delete_request') {
          setRequests(prev => prev.filter(r => r.id !== ev.id));
        }
        if (ev.type === 'connected') {
          setRealtimeConnected(true);
        }
      } catch { /* ignore */ }
    });

    return () => { es.close(); };
  }, []);

  const updateRequest = useCallback((id: string, updates: Partial<Request>) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }, []);

  const handleOnboardingDone = () => {
    setShowOnboarding(false);
    LS.set('gi-onboarding', 'done');
  };

  const navItems: { route: Route; icon: string; label: string }[] = [
    { route: 'inbox', icon: 'inbox', label: 'Inbox' },
    { route: 'matches', icon: 'users', label: 'Matches' },
    { route: 'connector', icon: 'spark', label: 'Connector' },
    { route: 'public', icon: 'external', label: 'My link' },
    { route: 'community', icon: 'grid', label: 'Community' },
    { route: 'types', icon: 'cog', label: 'Request types' },
  ];

  const crumbs: Record<Route, string[]> = {
    inbox: ['Inbox'],
    matches: ['Matches'],
    connector: ['Connector'],
    public: ['My link'],
    community: ['Community'],
    types: ['Settings', 'Request types'],
  };

  if (showOnboarding) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg)' }}>
        <Onboarding
          persona={persona}
          types={requestTypes}
          onDone={handleOnboardingDone}
        />
      </div>
    );
  }

  // Public link with submit form
  if (selectedType && route === 'public') {
    return (
      <Shell
        persona={persona}
        route={route}
        navItems={navItems}
        sidebarOpen={sidebarOpen}
        onMenu={() => setSidebarOpen(!sidebarOpen)}
        onNav={(r) => { setRoute(r as Route); setSelectedType(null); }}
        onTweaks={() => setTweaksOpen(true)}
        realtimeConnected={realtimeConnected}
        crumbs={['My link', selectedType.name]}
        unreadCount={requests.filter(r => r.unread).length}
      >
        <SubmitForm type={selectedType} persona={persona} onBack={() => setSelectedType(null)} />
        <TweaksPanel
          open={tweaksOpen} onClose={() => setTweaksOpen(false)}
          theme={theme} density={density} typeface={typeface}
          inboxVariant={inboxVariant} aiMode={aiMode}
          personaIndex={personaIdx} accentColor={accent} personaCount={personas.length}
          onTheme={setThemeP} onDensity={setDensityP} onTypeface={setTypefaceP}
          onInboxVariant={setInboxVariantP} onAiMode={setAiModeP}
          onPersona={setPersonaP} onAccent={setAccentP}
          onReplayOnboarding={() => { setShowOnboarding(true); setTweaksOpen(false); }}
        />
      </Shell>
    );
  }

  const renderContent = () => {
    switch (route) {
      case 'inbox':
        return (
          <Inbox
            variant={inboxVariant}
            requests={requests}
            selectedId={selectedRequestId}
            onSelect={(id) => { setSelectedRequestId(id); setRequests(prev => prev.map(r => r.id === id ? { ...r, unread: false } : r)); }}
            onUpdateRequest={updateRequest}
          />
        );
      case 'matches':
        return networkNodes.length > 0 ? <Matches nodes={networkNodes} /> : (
          <div style={{ display: 'grid', placeItems: 'center', height: '60vh', color: 'var(--fg-mute)' }}>Loading matches…</div>
        );
      case 'connector':
        return <ConnectorSetup persona={persona} />;
      case 'public':
        return <PublicLink persona={persona} types={requestTypes} onPickType={setSelectedType} />;
      case 'community':
        return communityData ? <Community data={communityData} /> : (
          <div style={{ display: 'grid', placeItems: 'center', height: '60vh', color: 'var(--fg-mute)' }}>Loading community…</div>
        );
      case 'types':
        return <RequestTypesSettings types={requestTypes} />;
    }
  };

  return (
    <Shell
      persona={persona}
      route={route}
      navItems={navItems}
      sidebarOpen={sidebarOpen}
      onMenu={() => setSidebarOpen(!sidebarOpen)}
      onNav={(r) => { setRoute(r as Route); setSelectedType(null); }}
      onTweaks={() => setTweaksOpen(true)}
      realtimeConnected={realtimeConnected}
      crumbs={crumbs[route]}
      unreadCount={requests.filter(r => r.unread).length}
    >
      {renderContent()}
      <TweaksPanel
        open={tweaksOpen} onClose={() => setTweaksOpen(false)}
        theme={theme} density={density} typeface={typeface}
        inboxVariant={inboxVariant} aiMode={aiMode}
        personaIndex={personaIdx} accentColor={accent} personaCount={personas.length}
        onTheme={setThemeP} onDensity={setDensityP} onTypeface={setTypefaceP}
        onInboxVariant={setInboxVariantP} onAiMode={setAiModeP}
        onPersona={setPersonaP} onAccent={setAccentP}
        onReplayOnboarding={() => { setShowOnboarding(true); setTweaksOpen(false); }}
      />
    </Shell>
  );
}
