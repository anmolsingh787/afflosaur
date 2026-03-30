// ==========================================
// Afflosaur - Sound Manager Hook
// ==========================================

import { useState, useCallback } from 'react';

interface SoundOptions {
  volume?: number;
  loop?: boolean;
  preload?: boolean;
}

class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private masterVolume: number = 0.5;
  private enabled: boolean = true;

  constructor() {
    // Load saved preferences
    const savedVolume = localStorage.getItem('afflosaur_sound_volume');
    const savedEnabled = localStorage.getItem('afflosaur_sound_enabled');

    if (savedVolume) this.masterVolume = parseFloat(savedVolume);
    if (savedEnabled) this.enabled = savedEnabled === 'true';
  }

  // Load a sound file
  load(name: string, src: string, options: SoundOptions = {}) {
    const audio = new Audio(src);
    audio.volume = (options.volume || 1) * this.masterVolume;
    audio.loop = options.loop || false;
    audio.preload = options.preload ? 'auto' : 'none';

    this.sounds.set(name, audio);
    return audio;
  }

  // Play a sound
  play(name: string) {
    if (!this.enabled) return;

    const audio = this.sounds.get(name);
    if (audio) {
      // Reset to beginning if already playing
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Sound autoplay blocked by browser or file not found — safe to ignore
      });
    }
  }

  // Stop a sound
  stop(name: string) {
    const audio = this.sounds.get(name);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  // Set master volume
  setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('afflosaur_sound_volume', this.masterVolume.toString());

    // Update all loaded sounds
    this.sounds.forEach(audio => {
      audio.volume = audio.volume / (audio.volume / this.masterVolume) * this.masterVolume;
    });
  }

  // Enable/disable all sounds
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem('afflosaur_sound_enabled', enabled.toString());
  }

  // Get current settings
  getSettings() {
    return {
      volume: this.masterVolume,
      enabled: this.enabled
    };
  }
}

// Global sound manager instance
const soundManager = new SoundManager();

// Pre-load common sounds
soundManager.load('click', '/sounds/click.mp3', { volume: 0.3 });
soundManager.load('success', '/sounds/success.mp3', { volume: 0.4 });
soundManager.load('error', '/sounds/error.mp3', { volume: 0.4 });
soundManager.load('notification', '/sounds/notification.mp3', { volume: 0.5 });
soundManager.load('coin', '/sounds/coin.mp3', { volume: 0.6 });
soundManager.load('cart', '/sounds/cart.mp3', { volume: 0.4 });

export const useSound = () => {
  const [settings, setSettings] = useState(soundManager.getSettings());

  const playSound = useCallback((name: string) => {
    soundManager.play(name);
  }, []);

  const setVolume = useCallback((volume: number) => {
    soundManager.setVolume(volume);
    setSettings(soundManager.getSettings());
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    soundManager.setEnabled(enabled);
    setSettings(soundManager.getSettings());
  }, []);

  return {
    playSound,
    setVolume,
    setEnabled,
    settings
  };
};

// Export sound manager for direct use
export { soundManager };