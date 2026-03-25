import { AudioTrack } from '@music-library/core'

export function getTrackSrc(track: AudioTrack): string {
  if (typeof track.url === 'string') return track.url
  if (track.file instanceof Blob) return URL.createObjectURL(track.file)
  return ''
}

export function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '0:00'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
}
