import { SERVICES } from '@/lib/services';

const SERVICE_ICONS: Record<string, string> = {
  'oil-change': '🛢️',
  'tire-appointment': '🔧',
  'changing-skis': '⛷️',
  'spark-plugs': '⚡',
  'case-oil': '🔩',
  'gas-filters': '⛽',
  'air-filters': '💨',
  'kill-switch': '🔌',
  'rims': '⭕',
};

export default function ServicesTicker() {
  // Duplicate items to create seamless loop
  const items = [...SERVICES, ...SERVICES];

  return (
    <div className="bg-[#ff6b4a] overflow-hidden border-b border-[#e55a3a]">
      <div className="flex items-center gap-0 ticker-track">
        {items.map((svc, i) => (
          <div
            key={`${svc.id}-${i}`}
            className="flex items-center gap-2 px-5 py-2.5 whitespace-nowrap flex-shrink-0"
          >
            <span className="text-base leading-none">{SERVICE_ICONS[svc.id]}</span>
            <span className="text-white text-sm font-semibold tracking-wide">{svc.name}</span>
            <span className="text-white/40 text-lg font-thin ml-3">·</span>
          </div>
        ))}
      </div>

      <style>{`
        .ticker-track {
          animation: ticker 30s linear infinite;
          width: max-content;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
