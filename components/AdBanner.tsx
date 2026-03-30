// ==========================================
// Afflosaur - Sponsor Banner Carousel 🎯
// ==========================================

import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';

export function AdBanner() {
  const { theme, sponsorBanners } = useApp();
  const isDark = theme === 'dark';
  const [index, setIndex] = useState(0);

  const activeBanners = useMemo(() => {
    const now = new Date();
    return sponsorBanners.filter((b) => {
      if (b.status === 'inactive') return false;
      if (b.status === 'scheduled') {
        const start = b.startAt ? new Date(b.startAt) : null;
        const end = b.endAt ? new Date(b.endAt) : null;
        if (start && now < start) return false;
        if (end && now > end) return false;
      }
      return true;
    });
  }, [sponsorBanners]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  return (
    <div className={`w-full ${isDark ? 'bg-gray-900' : 'bg-orange-50'} border-b ${isDark ? 'border-gray-800' : 'border-orange-100'}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2">
        <div className="relative overflow-hidden rounded-xl">
          {activeBanners.map((banner, i) => (
            <a
              key={banner.id}
              href={banner.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`block transition-opacity duration-500 ${i === index ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}
            >
              <div className="relative">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-24 sm:h-28 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/35" />
                <div className="absolute left-3 bottom-2 text-white">
                  <p className="text-xs sm:text-sm font-bold">{banner.title}</p>
                  {banner.description && (
                    <p className="text-[10px] sm:text-xs text-white/80">{banner.description}</p>
                  )}
                </div>
              </div>
            </a>
          ))}

          <div className="absolute right-3 top-2 flex gap-1">
            {activeBanners.map((_, i) => (
              <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
