import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useSound } from '../hooks/useSound';

export default function AdPopup() {
  const { sponsorPopups, theme } = useApp();
  const { playSound } = useSound();
  const isDark = theme === 'dark';
  const [visible, setVisible] = useState(false);
  const [popupId, setPopupId] = useState<string | null>(null);

  const activePopups = useMemo(() => {
    const now = new Date();
    return sponsorPopups.filter((p) => {
      if (p.status === 'inactive') return false;
      if (p.status === 'scheduled') {
        const start = p.startAt ? new Date(p.startAt) : null;
        const end = p.endAt ? new Date(p.endAt) : null;
        if (start && now < start) return false;
        if (end && now > end) return false;
      }
      return true;
    });
  }, [sponsorPopups]);

  const popup = useMemo(() => activePopups[0] || null, [activePopups]);

  useEffect(() => {
    if (!popup) return;
    if (popup.id === popupId) return;

    if (popup.trigger === 'on_load') {
      setPopupId(popup.id);
      setVisible(true);
      return;
    }

    if (popup.trigger === 'after_seconds') {
      const delay = Math.max(1, popup.triggerSeconds || 5) * 1000;
      const timer = setTimeout(() => {
        setPopupId(popup.id);
        setVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }

    if (popup.trigger === 'on_scroll') {
      const onScroll = () => {
        const scrolled = window.scrollY + window.innerHeight;
        const height = document.documentElement.scrollHeight;
        if (scrolled >= height * 0.5) {
          setPopupId(popup.id);
          setVisible(true);
          window.removeEventListener('scroll', onScroll);
        }
      };
      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
    }

    if (popup.trigger === 'exit_intent') {
      const onExit = (e: MouseEvent) => {
        if (e.clientY <= 0) {
          setPopupId(popup.id);
          setVisible(true);
          document.removeEventListener('mouseout', onExit);
        }
      };
      document.addEventListener('mouseout', onExit);
      return () => document.removeEventListener('mouseout', onExit);
    }
  }, [popup, popupId]);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => playSound('notification'), 300);
      return () => clearTimeout(timer);
    }
  }, [visible, playSound]);

  if (!popup || !visible) return null;

  const handleCta = () => {
    if (popup.link) window.open(popup.link, '_blank');
    setVisible(false);
    playSound('click');
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
      <div className={`w-full max-w-sm rounded-2xl p-5 shadow-2xl ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-black">{popup.title}</h3>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{popup.content}</p>
          </div>
          <button
            onClick={() => setVisible(false)}
            className={`text-xs px-2 py-1 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
          >
            Close
          </button>
        </div>

        {popup.image && (
          <img
            src={popup.image}
            alt={popup.title}
            className="w-full h-40 object-cover rounded-xl mt-3"
            loading="lazy"
          />
        )}

        <button
          onClick={handleCta}
          className="mt-4 w-full py-2.5 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white font-bold"
        >
          {popup.ctaText || 'Check Now'}
        </button>
      </div>
    </div>
  );
}
