/**
 * CategorySlider.tsx
 * Premium horizontal category slider with:
 * - Drag to scroll (mouse + touch)
 * - Scroll progress indicator
 * - Left/right navigation arrows
 * - Active pill animation
 * - Fade gradient edges
 * - Mobile swipe support
 * - Dark mode support
 */

import { useRef, useState, useEffect, useCallback } from 'react';

interface CategorySliderProps {
  categories?: string[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  variant?: 'default' | 'compact' | 'pills' | 'underline';
  showIcons?: boolean;
  sticky?: boolean;
  className?: string;
}

// Category icons mapping
const categoryIcons: Record<string, string> = {
  'All': '🛍️',
  'Electronics': '📱',
  'Fashion': '👗',
  'Home & Kitchen': '🏠',
  'Home': '🏠',
  'Beauty': '💄',
  'Fitness': '💪',
  'Books': '📚',
  'Toys': '🎮',
  'Grocery': '🛒',
  'Prayagraj Local': '📍',
  'Under ₹500': '💰',
  'Under ₹999': '🏷️',
  'Trending': '🔥',
  'New Arrivals': '✨',
  'New': '✨',
  'Best Deals': '⚡',
  'Top Rated': '⭐',
  'Gadgets': '🎧',
  'Sports': '⚽',
  'Automotive': '🚗',
  'Baby': '👶',
  'Pet': '🐾',
};

const defaultCategories = [
  'All',
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Beauty',
  'Fitness',
  'Prayagraj Local',
  'Under ₹500',
  'Trending',
  'New Arrivals',
  'Best Deals',
  'Top Rated',
  'Gadgets',
];

export default function CategorySlider({
  categories = defaultCategories,
  activeCategory,
  onCategoryChange,
  variant = 'default',
  showIcons = true,
  sticky = false,
  className = '',
}: CategorySliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(activeCategory || categories[0]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);
  const dragMoved = useRef(false);

  // Update active when prop changes
  useEffect(() => {
    if (activeCategory) setActive(activeCategory);
  }, [activeCategory]);

  // Check scroll state
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      setScrollProgress(0);
      return;
    }
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < maxScroll - 5);
    setScrollProgress((el.scrollLeft / maxScroll) * 100);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  // Scroll to active category
  const scrollToActive = useCallback((cat: string) => {
    const el = scrollRef.current;
    if (!el) return;
    const buttons = el.querySelectorAll('button');
    const idx = categories.indexOf(cat);
    if (idx >= 0 && buttons[idx]) {
      const btn = buttons[idx];
      const containerCenter = el.clientWidth / 2;
      const btnCenter = btn.offsetLeft + btn.clientWidth / 2;
      el.scrollTo({
        left: btnCenter - containerCenter,
        behavior: 'smooth',
      });
    }
  }, [categories]);

  // Handle category click
  const handleClick = (cat: string) => {
    if (dragMoved.current) return; // Don't select if was dragging
    setActive(cat);
    onCategoryChange?.(cat);
    scrollToActive(cat);
  };

  // Arrow scroll
  const scrollBy = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === 'left' ? -200 : 200;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragMoved.current = false;
    dragStartX.current = e.clientX;
    scrollStartX.current = scrollRef.current?.scrollLeft || 0;
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 3) dragMoved.current = true;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollStartX.current - dx;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Reset dragMoved after a tick so click handler can check it
    setTimeout(() => { dragMoved.current = false; }, 50);
  };

  // Touch is handled natively by overflow-x-auto

  // Pill style classes
  const getPillClass = (cat: string) => {
    const isActive = active === cat;

    if (variant === 'underline') {
      return `relative whitespace-nowrap px-4 py-2.5 text-sm font-semibold transition-all duration-300 border-b-2 ${
        isActive
          ? 'border-orange-500 text-orange-600 dark:text-orange-400'
          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
      }`;
    }

    if (variant === 'compact') {
      return `whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
        isActive
          ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`;
    }

    if (variant === 'pills') {
      return `whitespace-nowrap px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
        isActive
          ? 'bg-linear-to-r from-orange-500 via-amber-500 to-yellow-500 text-white shadow-lg shadow-orange-500/30 scale-105'
          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-orange-300'
      }`;
    }

    // Default
    return `whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
      isActive
        ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 scale-[1.03]'
        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600'
    }`;
  };

  const stickyClass = sticky
    ? 'sticky top-[60px] z-30 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80'
    : '';

  return (
    <div className={`relative w-full ${stickyClass} ${className}`}>
      {/* Left fade gradient */}
      <div
        className={`pointer-events-none absolute left-0 top-0 h-[calc(100%-6px)] w-12 bg-linear-to-r from-white dark:from-gray-900 to-transparent z-20 transition-opacity duration-300 ${
          canScrollLeft ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Right fade gradient */}
      <div
        className={`pointer-events-none absolute right-0 top-0 h-[calc(100%-6px)] w-12 bg-linear-to-l from-white dark:from-gray-900 to-transparent z-20 transition-opacity duration-300 ${
          canScrollRight ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Left arrow */}
      <button
        onClick={() => scrollBy('left')}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-500 transition-all duration-300 ${
          canScrollLeft ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
        }`}
        aria-label="Scroll left"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right arrow */}
      <button
        onClick={() => scrollBy('right')}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-500 transition-all duration-300 ${
          canScrollRight ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
        }`}
        aria-label="Scroll right"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Scrollable categories */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`flex gap-2.5 overflow-x-auto no-scrollbar px-6 py-3 select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleClick(cat)}
            className={getPillClass(cat)}
          >
            <span className="flex items-center gap-1.5">
              {showIcons && categoryIcons[cat] && (
                <span className="text-base">{categoryIcons[cat]}</span>
              )}
              <span>{cat}</span>
            </span>

            {/* Active dot indicator */}
            {active === cat && variant === 'default' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50" />
            )}
          </button>
        ))}
      </div>

      {/* Bottom scroll progress bar */}
      <div className="h-[3px] w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-full transition-all duration-150 ease-out shadow-sm shadow-orange-500/30"
          style={{ width: `${Math.max(scrollProgress, 8)}%`, marginLeft: `${scrollProgress * 0.67}%` }}
        />
      </div>
    </div>
  );
}
