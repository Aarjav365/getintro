'use client';
import { Icon } from './Icons';

const ACCENTS = [
  { name: 'lime', value: '#b8ff3a' },
  { name: 'blue', value: '#60a5fa' },
  { name: 'violet', value: '#a78bfa' },
  { name: 'pink', value: '#f472b6' },
  { name: 'amber', value: '#fbbf24' },
  { name: 'cyan', value: '#22d3ee' },
];

interface TweaksPanelProps {
  open: boolean;
  onClose: () => void;
  theme: string;
  density: string;
  typeface: string;
  inboxVariant: string;
  aiMode: string;
  personaIndex: number;
  accentColor: string;
  personaCount: number;
  onTheme: (v: string) => void;
  onDensity: (v: string) => void;
  onTypeface: (v: string) => void;
  onInboxVariant: (v: string) => void;
  onAiMode: (v: string) => void;
  onPersona: (i: number) => void;
  onAccent: (v: string) => void;
  onReplayOnboarding: () => void;
}

function TweakRow({ label, options, active, onSelect }: { label: string; options: [string, string][]; active: string; onSelect: (v: string) => void }) {
  return (
    <div className="tweak-row">
      <div className="tweak-label">{label}</div>
      <div className="tweak-options">
        {options.map(([v, l]) => (
          <button key={v} className={`tweak-opt ${active === v ? 'active' : ''}`} onClick={() => onSelect(v)}>{l}</button>
        ))}
      </div>
    </div>
  );
}

export function TweaksPanel({
  open, onClose, theme, density, typeface, inboxVariant, aiMode,
  personaIndex, accentColor, personaCount,
  onTheme, onDensity, onTypeface, onInboxVariant, onAiMode,
  onPersona, onAccent, onReplayOnboarding,
}: TweaksPanelProps) {
  if (!open) return null;

  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 99 }}
        onClick={onClose}
      />
      <div className="tweaks-panel">
        <div className="tweaks-head">
          <div className="tweaks-head-title">✦ TWEAKS</div>
          <button className="btn ghost sm" style={{ marginLeft: 'auto' }} onClick={onClose}>
            <Icon name="x" size={14} className="ic-sm" />
          </button>
        </div>
        <div className="tweaks-body">
          <div className="tweak-row">
            <div className="tweak-label">Accent</div>
            <div className="tweak-options">
              {ACCENTS.map(a => (
                <button
                  key={a.name}
                  className={`tweak-swatch ${accentColor === a.value ? 'active' : ''}`}
                  style={{ background: a.value }}
                  onClick={() => onAccent(a.value)}
                  title={a.name}
                />
              ))}
            </div>
          </div>

          <TweakRow label="Theme" options={[['dark', 'Dark'], ['light', 'Light']]} active={theme} onSelect={onTheme} />
          <TweakRow label="Density" options={[['default', 'Default'], ['compact', 'Compact']]} active={density} onSelect={onDensity} />
          <TweakRow label="Typeface" options={[['geist', 'Geist'], ['inter', 'Inter'], ['mono', 'Mono'], ['serif', 'Serif']]} active={typeface} onSelect={onTypeface} />
          <TweakRow label="Inbox" options={[['list', 'List'], ['stack', 'Deck']]} active={inboxVariant} onSelect={onInboxVariant} />
          <TweakRow label="AI mode" options={[['copilot', 'Copilot'], ['auto', 'Auto']]} active={aiMode} onSelect={onAiMode} />

          <div className="tweak-row">
            <div className="tweak-label">Persona</div>
            <div className="tweak-options">
              {Array.from({ length: personaCount }).map((_, i) => (
                <button key={i} className={`tweak-opt ${personaIndex === i ? 'active' : ''}`} onClick={() => onPersona(i)}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <button className="btn sm" style={{ width: '100%', justifyContent: 'center' }} onClick={onReplayOnboarding}>
            <Icon name="refresh" size={13} className="ic-sm" />Replay onboarding
          </button>
        </div>
      </div>
    </>
  );
}
