import { AudioTrack } from '@music-library/core'
import { HiMusicalNote, HiChevronRight } from 'react-icons/hi2'
import { MdPlayArrow } from 'react-icons/md'
import { truncateText } from '../utils'

interface YouMightLikeProps {
  tracks: AudioTrack[]
  onTrackClick: (track: AudioTrack) => void
  currentTrack: AudioTrack | null
  isPlaying: boolean
  isMobile?: boolean
}

export function YouMightLike({
  tracks,
  onTrackClick,
  currentTrack,
  isPlaying,
  isMobile,
}: YouMightLikeProps) {
  const displayTracks = isMobile ? tracks.slice(0, 3) : tracks.slice(0, 4)
  const padding = isMobile ? 'p-3' : 'p-4'
  const gap = isMobile ? 'gap-2' : 'gap-3'
  const textTruncate = isMobile ? 18 : 20

  return (
    <div className={`glass ${padding} flex flex-col ${gap} rounded-2xl shadow-lg border border-gray-200 dark:border-white/10`}>
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">You Might Like</h3>
        <HiChevronRight size={20} className="text-gray-500 dark:text-white/60" />
      </div>

      <div className={`space-y-${isMobile ? '2' : '2.5'}`}>
        {displayTracks.map((track, idx) => (
          <button
            key={idx}
            onClick={() => onTrackClick(track)}
            className={`w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md ${
              currentTrack?.name === track.name
                ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 ring-2 ring-purple-500'
                : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/15'
            }`}
          >
            <div className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-pink-500/40 to-purple-600/40 flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-all`}>
              <HiMusicalNote size={isMobile ? 16 : 20} className="text-white/70" />
              {currentTrack?.name === track.name && isPlaying && (
                <div className="absolute inset-0 animate-pulse bg-purple-500/30 rounded-xl" />
              )}
            </div>

            <div className="flex-1 text-left min-w-0">
              <p className="text-xs sm:text-sm font-semibold truncate text-gray-900 dark:text-white">
                {truncateText(track.name, textTruncate)}
              </p>
              <p className="text-xs text-gray-500 dark:text-white/60 truncate">
                {truncateText(track.artist || 'Unknown', textTruncate)}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onTrackClick(track)
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 p-2 rounded-lg bg-purple-500/30 hover:bg-purple-500/50 active:scale-95"
            >
              <MdPlayArrow size={isMobile ? 14 : 16} className="text-purple-300" />
            </button>
          </button>
        ))}
      </div>
    </div>
  )
}
