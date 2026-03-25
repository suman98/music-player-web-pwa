// Media Session API utilities for lock screen controls
import { AudioTrack } from '@music-library/core'

export interface MediaSessionHandlers {
  onPlay?: () => void
  onPause?: () => void
  onNext?: () => void
  onPrevious?: () => void
  onSeek?: (time: number) => void
}

/**
 * Update the media session metadata displayed on lock screen
 * @param track - Current track information
 * @param isPlaying - Whether audio is currently playing
 * @param currentTime - Current playback time in seconds
 * @param duration - Total track duration in seconds
 */
export function updateMediaSession(
  track: AudioTrack | null,
  isPlaying: boolean,
  currentTime: number = 0,
  duration: number = 0
) {
  // Check if Media Session API is supported
  if (!navigator.mediaSession) {
    console.warn('[MediaSession] Not supported in this browser')
    return
  }

  if (!track) {
    navigator.mediaSession.metadata = null
    return
  }

  try {
    // Create metadata for lock screen display
    const metadata = new MediaMetadata({
      title: track.name || 'Unknown Track',
      artist: track.artist || 'Unknown Artist',
      album: track.album || 'Music Player',
      // You can add artwork here if available (requires image URL)
      artwork: [
        {
          src: '/icons/icon-192x192.svg',
          sizes: '192x192',
          type: 'image/svg+xml',
        },
        {
          src: '/icons/icon-512x512.svg',
          sizes: '512x512',
          type: 'image/svg+xml',
        },
      ],
    })

    navigator.mediaSession.metadata = metadata

    // Update playback state
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused'

    // Update position state for progress bar on lock screen
    if (duration && duration > 0) {
      try {
        navigator.mediaSession.setPositionState({
          duration: duration,
          playbackRate: 1,
          position: currentTime || 0,
        })
      } catch (err) {
        console.warn('[MediaSession] setPositionState not supported:', err)
      }
    }

    console.log('[MediaSession] ✅ Updated:', {
      title: track.name,
      artist: track.artist,
      playbackState: isPlaying ? 'playing' : 'paused',
    })
  } catch (error) {
    console.error('[MediaSession] Error updating metadata:', error)
  }
}

/**
 * Register media session action handlers for lock screen controls
 * @param handlers - Object with callback functions for media actions
 */
export function registerMediaSessionHandlers(handlers: MediaSessionHandlers) {
  if (!navigator.mediaSession) {
    console.warn('[MediaSession] Not supported in this browser')
    return
  }

  try {
    // Play handler
    if (handlers.onPlay) {
      navigator.mediaSession.setActionHandler('play', () => {
        console.log('[MediaSession] Play action triggered')
        handlers.onPlay?.()
      })
    }

    // Pause handler
    if (handlers.onPause) {
      navigator.mediaSession.setActionHandler('pause', () => {
        console.log('[MediaSession] Pause action triggered')
        handlers.onPause?.()
      })
    }

    // Next track handler
    if (handlers.onNext) {
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        console.log('[MediaSession] Next track action triggered')
        handlers.onNext?.()
      })
    }

    // Previous track handler
    if (handlers.onPrevious) {
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        console.log('[MediaSession] Previous track action triggered')
        handlers.onPrevious?.()
      })
    }

    // Skip forward (15 seconds)
    if (handlers.onSeek) {
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const skipTime = (details as any).seekOffset || 15
        console.log('[MediaSession] Skip forward:', skipTime)
        handlers.onSeek?.(skipTime)
      })
    }

    // Skip backward (15 seconds)
    if (handlers.onSeek) {
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        const skipTime = (details as any).seekOffset || 15
        console.log('[MediaSession] Skip backward:', skipTime)
        handlers.onSeek?.(-skipTime)
      })
    }

    console.log('[MediaSession] ✅ Action handlers registered')
  } catch (error) {
    console.error('[MediaSession] Error registering handlers:', error)
  }
}

/**
 * Clear media session when no track is playing
 */
export function clearMediaSession() {
  if (!navigator.mediaSession) return

  try {
    navigator.mediaSession.metadata = null
    navigator.mediaSession.playbackState = 'none'
    console.log('[MediaSession] Cleared')
  } catch (error) {
    console.error('[MediaSession] Error clearing session:', error)
  }
}
