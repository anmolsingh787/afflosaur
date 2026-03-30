# Adding Sound Effects to Afflosaur

## Step 1: Add Sound Files
Place your audio files in the `public/sounds/` directory:

```
public/
  sounds/
    click.mp3      # Button clicks (0.3 volume)
    success.mp3    # Success actions (0.4 volume)
    error.mp3      # Error notifications (0.4 volume)
    notification.mp3 # General notifications (0.5 volume)
    coin.mp3       # Coin earnings (0.6 volume)
    cart.mp3       # Cart additions (0.4 volume)
```

## Step 2: Sound File Recommendations
- **Format:** MP3 (widely supported)
- **Duration:** 1-2 seconds max
- **Quality:** 128kbps, mono
- **Sources:** Free sound libraries like:
  - Freesound.org
  - Zapsplat.com
  - Mixkit.co
  - Pixabay.com

## Step 3: Current Sound Integration
Sounds are automatically played for:
- ✅ Button clicks
- ✅ Adding items to cart
- ✅ Earning coins
- ✅ Success actions (wishlist, share)
- ✅ Error notifications

## Step 4: User Controls
Users can control sounds in Settings:
- Enable/disable all sounds
- Adjust master volume (0-100%)
- Test sounds with "Test" button

## Step 5: Adding More Sounds
To add sounds to new actions:

```typescript
import { useSound } from '../hooks/useSound';

const { playSound } = useSound();

// Play a sound
playSound('click'); // For button interactions
playSound('success'); // For positive actions
playSound('coin'); // For coin earnings
```

## Step 6: Custom Sounds
To add new sound types, update the `useSound.ts` hook:

```typescript
// Pre-load new sounds
soundManager.load('newSound', '/sounds/newSound.mp3', { volume: 0.5 });
```

## Browser Compatibility
- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support
- ⚠️ Mobile Safari: May require user interaction first
- ⚠️ iOS: May need user gesture to enable audio

## Best Practices
1. Keep sounds short and non-repetitive
2. Respect user preferences (enable/disable)
3. Test on multiple devices
4. Use appropriate volumes (don't be annoying)
5. Provide visual feedback alongside sounds