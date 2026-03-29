import { AudioTrack } from '@music-library/core'
import { HiMusicalNote } from 'react-icons/hi2'
import { truncateText } from '../utils'

interface CurrentlyPlayingProps {
  track: AudioTrack | null
  isPlaying: boolean
  isMobile?: boolean
}

export function CurrentlyPlaying({ track, isPlaying, isMobile }: CurrentlyPlayingProps) {
  const coverSize = isMobile ? 'w-32 h-32' : 'w-48 h-48'
  const titleSize = isMobile ? 'text-xl' : 'text-2xl'
  const padding = isMobile ? 'p-3' : 'p-4'

  return (
    <div className={`glass ${padding} flex flex-col items-center gap-3 sm:gap-4 flex-shrink-0 rounded-2xl shadow-xl border border-gray-200 dark:border-white/10`}>
      {/* Album/Cover */}
      <div className={`relative ${coverSize} rounded-xl overflow-hidden`}>
        <div className={`w-full h-full bg-gradient-to-br from-pink-500/40 to-purple-600/40 backdrop-blur-md flex items-center justify-center border-4 border-gray-300 dark:border-white/30 shadow-2xl rounded-xl`}>
          {track ? (
            <div className="text-4xl sm:text-6xl opacity-90">♪</div>
          ) : (
            <HiMusicalNote size={isMobile ? 48 : 80} className="opacity-40" />
          )}
        </div>
        {isPlaying && (
          <>
            <div className="absolute inset-0 border-4 border-transparent border-t-pink-400 border-r-purple-400 animate-spin rounded-xl" />
            <div className="absolute inset-1 border-2 border-transparent border-b-pink-400 border-l-purple-400 animate-spin-slow rounded-xl" style={{ animationDirection: 'reverse' }} />
          </>
        )}
      </div>

      {/* Track Info */}
      <div className="text-center">
        <h2 className={`${titleSize} font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent`}>
          {track ? truncateText(track.name, isMobile ? 20 : 30) : 'No track selected'}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70 mt-2 font-medium">
          {track?.artist || 'Unknown Artist'}
        </p>
      </div>
    </div>
  )
}
