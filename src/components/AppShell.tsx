// AppShell.tsx — Logo, TopBar, Sidebar, AppShell layout

import { Icon } from './Icon';
import { CHAPTERS, STRINGS, type Lang } from '../lib/data';

type Route = { view: 'landing' } | { view: 'chapter'; chapter: string };

interface AppShellProps {
  children: React.ReactNode;
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  route: Route;
  setRoute: (r: Route) => void;
}

// ── Logo ──────────────────────────────────────────────────────────
const Logo = ({ lang }: { lang: Lang }) => {
  const s = STRINGS[lang];
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, userSelect: 'none' }}>
      <span style={{
        fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600,
        fontStyle: 'italic', color: 'var(--fg-1)', letterSpacing: '-0.01em',
      }}>{s.appName}</span>
      <span style={{
        fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--fg-3)',
        borderLeft: '1px solid var(--hairline)', paddingLeft: 8,
      }}>· {s.appSuffix}</span>
    </div>
  );
};

// ── TopBar ────────────────────────────────────────────────────────
const TopBar = ({ lang, setLang, theme, setTheme }: Pick<AppShellProps, 'lang' | 'setLang' | 'theme' | 'setTheme'>) => {
  const nav = STRINGS[lang].nav;
  return (
    <header style={{
      gridArea: 'top',
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '0 20px', height: 56,
      background: 'var(--surface)', borderBottom: '1px solid var(--hairline)',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <Logo lang={lang} />
      <div style={{ flex: 1, maxWidth: 520, marginLeft: 24 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'var(--surface-3)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-sm)', padding: '7px 12px',
          color: 'var(--fg-3)', fontSize: 13.5,
        }}>
          <Icon name="Search" size={16} />
          <span style={{ flex: 1 }}>{nav.search}</span>
          <kbd style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            background: 'var(--surface)', border: '1px solid var(--hairline)',
            borderRadius: 'var(--r-xs)', padding: '1px 6px', color: 'var(--fg-2)',
          }}>{nav.shortcut}</kbd>
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <button
        onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'transparent', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-sm)', padding: '5px 10px',
          fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600,
          color: 'var(--fg-2)', cursor: 'pointer', letterSpacing: '0.06em',
        }}>
        <Icon name="Languages" size={14} />
        {lang.toUpperCase()} <span style={{ color: 'var(--fg-4)' }}>/ {lang === 'es' ? 'EN' : 'ES'}</span>
      </button>
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        title="Toggle theme"
        style={{
          background: 'transparent', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-sm)', padding: 6, color: 'var(--fg-2)', cursor: 'pointer',
          display: 'inline-flex',
        }}>
        <Icon name={theme === 'light' ? 'Moon' : 'Sun'} size={16} />
      </button>
      <div style={{
        width: 32, height: 32, borderRadius: 'var(--r-pill)',
        background: 'var(--accent)', color: 'var(--on-accent)',
        display: 'grid', placeItems: 'center',
        fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600,
      }}>MV</div>
    </header>
  );
};

// ── Sidebar ───────────────────────────────────────────────────────
const Sidebar = ({ lang, route, setRoute }: Pick<AppShellProps, 'lang' | 'route' | 'setRoute'>) => {
  const nav = STRINGS[lang].nav;
  const chapters = STRINGS[lang].chapters;
  const activeChapter = route.view === 'chapter' ? route.chapter : null;

  return (
    <aside style={{
      gridArea: 'side',
      background: 'var(--surface)', borderRight: '1px solid var(--hairline)',
      padding: '20px 12px', overflowY: 'auto',
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{
        padding: '4px 12px 8px', fontSize: 11, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-3)',
      }}>
        {nav.library}
      </div>

      {CHAPTERS.map(ch => {
        const meta = chapters[ch.id as keyof typeof chapters];
        const active = activeChapter === ch.id;
        return (
          <button
            key={ch.id}
            onClick={() => setRoute({ view: 'chapter', chapter: ch.id })}
            style={sideNavBtn(active)}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--surface-2)'; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
          >
            <Icon name={ch.icon} size={16} />
            <span style={{ flex: 1 }}>{meta.title}</span>
            <span style={{ fontSize: 11, color: 'var(--fg-4)', fontFamily: 'var(--font-mono)' }}>
              {ch.itemCount}
            </span>
          </button>
        );
      })}

      <div style={{ height: 1, background: 'var(--hairline)', margin: '12px 4px' }} />

      <button onClick={() => setRoute({ view: 'landing' })} style={sideNavBtn(route.view === 'landing')}>
        <Icon name="BookOpen" size={16} />
        <span style={{ flex: 1 }}>{nav.formulary}</span>
      </button>
      <button style={sideNavBtn(false)}>
        <Icon name="Bookmark" size={16} />
        <span style={{ flex: 1 }}>{nav.saved}</span>
      </button>
      <button style={sideNavBtn(false)}>
        <Icon name="HelpCircle" size={16} />
        <span style={{ flex: 1 }}>{nav.help}</span>
      </button>
    </aside>
  );
};

const sideNavBtn = (active: boolean): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '8px 12px', borderRadius: 'var(--r-sm)',
  background: active ? 'var(--accent-soft)' : 'transparent',
  border: 'none',
  borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent',
  color: active ? 'var(--fg-1)' : 'var(--fg-2)',
  fontSize: 13.5, fontFamily: 'var(--font-sans)', fontWeight: active ? 600 : 500,
  cursor: 'pointer', textAlign: 'left',
  transition: 'background var(--dur-fast) var(--ease-out)',
});

// ── AppShell ──────────────────────────────────────────────────────
export const AppShell = ({ children, lang, setLang, theme, setTheme, route, setRoute }: AppShellProps) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '264px 1fr',
    gridTemplateRows: '56px 1fr',
    gridTemplateAreas: '"top top" "side main"',
    height: '100vh',
    background: 'var(--bg)',
  }}>
    <TopBar lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
    <Sidebar lang={lang} route={route} setRoute={setRoute} />
    <main style={{ gridArea: 'main', overflowY: 'auto' }}>{children}</main>
  </div>
);

// Shared button styles exported for use in modules
export const primaryBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  padding: '11px 18px', background: 'var(--accent)', color: 'var(--on-accent)',
  border: '1px solid var(--accent)', borderRadius: 'var(--r-sm)',
  fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
  cursor: 'pointer', boxShadow: 'var(--shadow-1)',
};

export const ghostBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  padding: '11px 18px', background: 'var(--surface)', color: 'var(--fg-1)',
  border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
  fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500, cursor: 'pointer',
};

export type { Route };
