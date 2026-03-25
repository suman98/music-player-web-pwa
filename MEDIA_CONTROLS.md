# Mobile Lock Screen Controls

## Overview

Your Music Player now supports **lock screen controls** on mobile devices. When a user plays music and locks their phone, they can see:
- 🎵 **Track title** and artist name
- ⏯️ **Play/Pause** button
- ⏭️ **Next track** button
- ⏮️ **Previous track** button
- 📊 **Progress bar** (with seek support on some devices)

This is powered by the **Media Session API**, a modern Web API that integrates with the operating system's media controls.

---

## How It Works

### 1. **What the User Sees**

#### Android Notification/Lock Screen
```
┌─────────────────────────────────────┐
│  Music Player                       │
│  ────────────────────────────────   │
│  🎵 Song Title                      │
│     Artist Name                     │
│                                     │
│  [⏮] [⏸] [⏭]                       │
│                                     │
│  ─────●──────────── 2:35 / 5:10     │
└─────────────────────────────────────┘
```

#### Lock Screen (Android 11+)
```
┌─────────────────────────────────────┐
│     🔒 LOCK SCREEN                  │
│                                     │
│     🎵 Song Title - Artist Name     │
│     [⏮]        [⏸]        [⏭]      │
│                                     │
│     ─────●──────────── 2:35 / 5:10  │
└─────────────────────────────────────┘
```

#### Android Notification Panel
When the app is in the background, users can control playback from the notification tray using the media controls.

---

## Supported Devices & Browsers

| Device | Browser | Lock Screen | Notification | Note |
|--------|---------|-------------|--------------|------|
| **Android** | Chrome/Edge | ✅ | ✅ | Full support, shows artwork |
| **Android** | Firefox | ✅ | ✅ | Full support |
| **iPhone/iPad** | Safari | ⚠️ | ✅ | Limited (uses system controls) |
| **Desktop** | Chrome/Edge | N/A | ✅ | Shows in taskbar/OS controls |
| **macOS** | Chrome/Edge | N/A | ✅ | Touch bar controls supported |

---

## Implementation Details

### Files Added/Modified

**New Files:**
- [src/utils/mediaSession.ts](src/utils/mediaSession.ts) - Media Session API utilities

**Modified Files:**
- [src/App.tsx](src/App.tsx) - Integrated media session handlers

### Key Functions

#### 1. `updateMediaSession(track, isPlaying, currentTime, duration)`
Updates the lock screen display with:
- Track metadata (title, artist, album)
- App icon as artwork
- Current playback state
- Progress bar position

#### 2. `registerMediaSessionHandlers(handlers)`
Registers callbacks for lock screen button presses:
- **Play/Pause** - toggles audio playback
- **Next Track** - skips to next song
- **Previous Track** - goes to previous song
- **Skip Forward** - advances 15 seconds
- **Skip Backward** - rewinds 15 seconds

#### 3. `clearMediaSession()`
Clears the media session when no track is playing

---

## How It's Integrated

### Automatic Updates
The media session automatically updates when:
- ✅ User selects a different track
- ✅ Playback starts or pauses
- ✅ Track progress changes
- ✅ Player is no longer active

### Code Flow
```javascript
// When track changes
useEffect(() => {
  updateMediaSession(currentTrack, isPlaying, currentTime, duration)
}, [currentTrackIndex, tracks, isPlaying, currentTime, duration])

// When lock screen button is pressed
navigator.mediaSession.setActionHandler('play', () => {
  // Plays the current track
  audioRef.current.play()
})

// Similar for pause, next, previous, seek
```

---

## Browser Compatibility

### Desktop Windows 10/11
- **Chrome/Edge:** Full media control support via system taskbar
- **Firefox:** Full support with native notifications

### Android 5.0+
- **Chrome:** Full lock screen and notification support
- **Firefox:** Full support
- **Samsung Internet:** Full support

### iOS 14+
- **Safari:** Native controls through system (limited)
- Lock screen displays app controls
- Notification center media controls

### macOS
- **Chrome:** Touch Bar media controls
- **Safari:** Native media controls

---

## Testing Lock Screen Controls

### Android Testing

1. **Setup:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Open on Android:**
   - Install app (or use `npm run preview`)
   - Select music folder and play a track
   - Lock your phone

3. **Verify Lock Screen:**
   - Track title and artist visible
   - Play/Pause button works
   - Next/Previous buttons work
   - Pull down notification to see controls

### Desktop Testing

1. **Chrome Taskbar:**
   - Play music in the app
   - Hover over app in taskbar (Windows)
   - Media controls appear
   - Test pause, next, previous

2. **Media Keys on Keyboard:**
   - Some keyboards have dedicated media keys
   - Should work with the app playing
   - Even when app window isn't focused

---

## Troubleshooting

### Lock Screen Controls Not Appearing

**Cause 1: App Not Installed as PWA**
- Solution: Install app via "Add to Home Screen"
- Lock screen controls work best in installed app mode
- Will also work in browser but with limitations

**Cause 2: No Track Playing**
- Lock screen controls only show when audio is playing
- Select a music folder first
- Click play on a track

**Cause 3: Browser Not Supported**
- Some older browsers don't support Media Session API
- Update Chrome/Firefox to latest version
- Check browser console for errors

**Cause 4: WebView Limitations**
- Some apps embedding webviews may not fully support this
- Works best in Chrome browser or installed PWA

### Controls Not Responding

**Cause 1: Service Worker Issue**
- Clear browser cache
- Re-register service worker
- Check DevTools → Application → Service Workers

**Cause 2: App in Background**
- Some devices suspend script execution when backgrounded
- This is OS behavior to save battery
- Controls implementation handles this gracefully

---

## Advanced Features

### Auto-Update Playback Position
The progress bar on the lock screen updates every 250ms to show current position. Users can also drag the progress bar to seek (on Android 11+).

### Skip Buttons
- **Skip Forward: 15 seconds** (media skip forwards action)
- **Skip Backward: 15 seconds** (media skip backwards action)
- These are automatic and don't require configuration

### Artwork Display
The app logo from `public/icons/` is displayed on the lock screen. In the future, you can:
1. Extract album art from audio files
2. Display it on the lock screen
3. Update metadata with album images

---

## Future Enhancements

### 1. Album Art Display
```typescript
// Show actual album artwork instead of app icon
artwork: [
  {
    src: track.albumArt || '/icons/icon-192x192.svg',
    sizes: '192x192',
    type: 'image/png',
  }
]
```

### 2. Multiple Playback Rates
```typescript
// Support 0.75x, 1x, 1.25x, 1.5x speeds
navigator.mediaSession.setActionHandler('changeplaybackrate', (details) => {
  audioRef.current.playbackRate = details.playbackRate
})
```

### 3. Toggle Favorite
```typescript
// Heart icon on lock screen in future
setActionHandler('togglefavorite', () => {
  // Add track to favorites
})
```

---

## Testing Checklist

- [ ] Play a track in the app
- [ ] Lock your mobile device  
- [ ] Verify track title appears on lock screen
- [ ] Press play/pause button - controls audio playback
- [ ] Press next button - plays next track
- [ ] Press previous button - goes to previous track
- [ ] Unlock phone and resume playback
- [ ] Test in notification panel (pull down from top)
- [ ] Test in installed PWA mode (best experience)

---

## Performance Notes

- Media session updates are efficient and don't block playback
- Metadata fetching is asynchronous (won't stall audio)
- Position state updates use requestAnimationFrame internally
- Works even when app is minimized or screen is locked

---

## Browser Restrictions

The Media Session API requires:
- ✅ **HTTPS** (or localhost for testing)
- ✅ **User Interaction** (can't auto-play without user action)
- ✅ **Active Audio Context** (must have audio element)
- ✅ **Secure Context** (prevents unauthorized control)

---

## Console Logging

The implementation logs all media session actions. Open DevTools Console to see:

```
[MediaSession] ✅ Action handlers registered
[MediaSession] ✅ Updated: {
  title: "Song Name",
  artist: "Artist Name",  
  playbackState: "playing"
}
[MediaSession] Play action triggered
[MediaSession] Next track action triggered
[MediaSession] Previous track action triggered
```

These logs help with debugging and verifying the feature is working.

---

## Questions?

If you're having issues:
1. Check browser console for errors ([MediaSession] messages)
2. Verify app is running on HTTPS or localhost
3. Make sure audio is playing
4. Try in Chrome first (best support)
5. Clear cache if recently updated

Enjoy controlling music from your lock screen! 🎵
