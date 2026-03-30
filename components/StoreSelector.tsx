/**
 * 🏬 StoreSelector — Premium Multi-Store Dropdown
 * 
 * Shows a button with the current store, clicking opens a dropdown
 * with all stores, icons, descriptions, and product counts.
 * 
 * Features:
 * - Animated dropdown with spring effect
 * - Store icons and color coding
 * - Active store highlight
 * - Click outside to close
 * - Mobile responsive
 * - Dark mode support
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, MapPin, ShoppingBag } from 'lucide-react';
import { useStore, StoreId } from '../context/StoreContext';

interface StoreSelectorProps {
  variant?: 'header' | 'inline' | 'compact';
  onStoreChange?: (store: StoreId) => void;
}

export default function StoreSelector({ variant = 'header', onStoreChange }: StoreSelectorProps) {
  const { store, setStore, storeInfo, allStores } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }
  }, [isOpen]);

  const handleSelect = (id: StoreId) => {
    setStore(id);
    setIsOpen(false);
    onStoreChange?.(id);
  };

  // Compact variant for mobile
  if (variant === 'compact') {
    return (
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
            ${isOpen 
              ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white border-orange-500 shadow-lg shadow-orange-500/20' 
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600'
            }`}
        >
          <span className="text-base">{storeInfo.icon}</span>
          <span className="hidden sm:inline">{storeInfo.name}</span>
          <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 right-0 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-in">
            <div className="p-2">
              {allStores.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelect(s.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150
                    ${store === s.id 
                      ? `bg-linear-to-r ${s.gradient} text-white shadow-md` 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                  <span className="text-xl">{s.icon}</span>
                  <span className="font-medium text-sm">{s.name}</span>
                  {store === s.id && <Check size={14} className="ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Inline variant for pages
  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap gap-2">
        {allStores.map((s) => (
          <button
            key={s.id}
            onClick={() => handleSelect(s.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200
              ${store === s.id 
                ? `bg-linear-to-r ${s.gradient} text-white border-transparent shadow-lg` 
                : `${s.bgColor} ${s.textColor} ${s.borderColor} hover:shadow-md`
              }`}
          >
            <span>{s.icon}</span>
            <span>{s.name}</span>
          </button>
        ))}
      </div>
    );
  }

  // Header variant (default) — Premium dropdown
  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm border transition-all duration-300
          ${isOpen 
            ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white border-orange-500 shadow-xl shadow-orange-500/25 scale-[1.02]' 
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-lg text-gray-700 dark:text-gray-200'
          }`}
      >
        <ShoppingBag size={16} className={isOpen ? 'text-white' : 'text-orange-500'} />
        <span className="text-lg">{storeInfo.icon}</span>
        <span className="hidden md:inline max-w-[100px] truncate">{storeInfo.name}</span>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} 
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full mt-3 left-0 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
          style={{ animation: 'slideDown 0.2s ease-out' }}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-linear-to-r from-orange-500 to-amber-500">
            <h3 className="text-white font-bold text-sm">Select Store</h3>
            <p className="text-orange-100 text-xs mt-0.5">Browse deals from your favorite store</p>
          </div>

          {/* Store List */}
          <div className="p-2 max-h-[400px] overflow-y-auto">
            {allStores.map((s, index) => {
              const isActive = store === s.id;
              const isPrayagraj = s.id === 'prayagraj';
              
              return (
                <div key={s.id}>
                  {/* Divider before Prayagraj */}
                  {isPrayagraj && (
                    <div className="flex items-center gap-2 px-3 py-2 mt-1">
                      <MapPin size={12} className="text-green-500" />
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">Local Store</span>
                      <div className="flex-1 h-px bg-green-200 dark:bg-green-800" />
                    </div>
                  )}
                  {/* Divider before Afflosaur */}
                  {s.id === 'afflosaur' && (
                    <div className="flex items-center gap-2 px-3 py-2 mt-1">
                      <span className="text-xs">🦕</span>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Our Store</span>
                      <div className="flex-1 h-px bg-emerald-200 dark:bg-emerald-800" />
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleSelect(s.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200
                      ${isActive 
                        ? `bg-linear-to-r ${s.gradient} text-white shadow-lg transform scale-[1.02]` 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/80 hover:translate-x-1'
                      }`}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    {/* Store Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0
                      ${isActive ? 'bg-white/20' : `${s.bgColor} border ${s.borderColor}`}`}>
                      {s.icon}
                    </div>

                    {/* Store Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                          {s.name}
                        </span>
                        {isPrayagraj && !isActive && (
                          <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 text-[10px] font-bold rounded-full">LOCAL</span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                        {s.description}
                      </p>
                    </div>

                    {/* Check Mark */}
                    {isActive && (
                      <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center shrink-0">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
            <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center">
              🦕 Afflosaur compares prices across all stores
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
