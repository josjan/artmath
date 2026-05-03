// Icon.tsx — Lucide-style inline SVG icons (no CDN dependency)

interface IconProps {
  name: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

const paths: Record<string, React.ReactNode> = {
  Sigma:        <><path d="M18 6H6l6 6-6 6h12"/></>,
  MoveUpRight:  <><path d="M13 6h5v5"/><path d="M6 18 18 6"/></>,
  Slash:        <><path d="M5 19 19 5"/></>,
  Grid3x3:      <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></>,
  Shapes:       <><path d="M8 3 14 14H2z"/><circle cx="17" cy="17" r="4"/></>,
  Spline:       <><path d="M3 18C8 18 8 6 13 6s5 12 8 12"/><circle cx="3" cy="18" r="1.5"/><circle cx="13" cy="6" r="1.5"/></>,
  SquareDashed: <><path d="M5 3h2M11 3h2M17 3h2M21 5v2M21 11v2M21 17v2M19 21h-2M13 21h-2M7 21H5M3 19v-2M3 13v-2M3 7V5"/></>,
  Activity:     <><path d="M3 12h4l3-9 4 18 3-9h4"/></>,
  Waves:        <><path d="M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/><path d="M2 18c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/><path d="M2 6c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/></>,
  GitMerge:     <><circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="12" r="2.5"/><path d="M6 8.5v7M8.5 6c0 5 4 6 7 6"/></>,
  Search:       <><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>,
  Sun:          <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
  Moon:         <><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></>,
  ChevronRight: <><path d="m9 6 6 6-6 6"/></>,
  ChevronLeft:  <><path d="m15 6-6 6 6 6"/></>,
  ArrowRight:   <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  Bookmark:     <><path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16l7-4z"/></>,
  HelpCircle:   <><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 4 2c-1 .7-1.5 1.2-1.5 2.5"/><path d="M12 17h.01"/></>,
  BookOpen:     <><path d="M3 5h7a3 3 0 0 1 3 3v12"/><path d="M21 5h-7a3 3 0 0 0-3 3v12"/><path d="M3 5v14h7M21 5v14h-7"/></>,
  Languages:    <><path d="M5 8h7M9 5v3M5 12c0 4 4 5 7 0M13 19l4-9 4 9M14.5 16h5"/></>,
  Copy:         <><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></>,
  Share:        <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.5 10.5 7-4M8.5 13.5l7 4"/></>,
  RotateCcw:    <><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></>,
  Star:         <><path d="m12 2 3 7 7 .6-5.3 4.7L18.5 22 12 18 5.5 22l1.8-7.7L2 9.6 9 9z"/></>,
  Sparkles:     <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5l2.8 2.8M15.7 15.7l2.8 2.8M5.5 18.5l2.8-2.8M15.7 8.3l2.8-2.8"/></>,
};

export const Icon = ({ name, size = 18, strokeWidth = 1.75, className = '', ...rest }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size} height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...rest}
  >
    {paths[name] ?? null}
  </svg>
);
