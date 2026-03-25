import { AudioTrack } from '@music-library/core'
import { HiMusicalNote, HiChevronRight } from 'react-icons/hi2'
import { truncateText } from '../utils'

interface RecentlyPlayedProps {
  tracks: AudioTrack[]
  onTrackClick: (track: AudioTrack) => void
  currentTrack: AudioTrack | null
  isMobile?: boolean
}

export function RecentlyPlayed({
  tracks,
  onTrackClick,
  currentTrack,
  isMobile,
}: RecentlyPlayedProps) {
  const displayTracks = isMobile ? tracks.slice(0, 4) : tracks.slice(0, 3)
  const padding = isMobile ? 'p-3' : 'p-4'
  const gap = isMobile ? 'gap-1.5' : 'gap-2'
  const textTrackTruncate = isMobile ? 12 : 15
  const textArtistTruncate = isMobile ? 12 : 15

  return (
    <div className={`glass ${padding} flex flex-col ${gap} rounded-2xl shadow-lg border border-white/10`}>
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Recently Played</h3>
        <HiChevronRight size={20} className="opacity-60" />
      </div>

      <div className={`flex ${isMobile ? 'gap-2' : 'gap-3'} overflow-x-auto sm:overflow-visible pb-2 sm:pb-0`}>
        {displayTracks.map((track, idx) => (
          <button
            key={idx}
            onClick={() => onTrackClick(track)}
            className={`relative flex-shrink-0 ${isMobile ? 'w-28' : 'flex-1'} rounded-xl p-2 sm:p-3 text-left transition-all duration-300 group shadow-md hover:shadow-lg ${
              currentTrack?.name === track.name
                ? 'glass-sm ring-2 ring-purple-500 scale-105'
                : 'glass-sm hover:bg-white/15 hover:scale-105'
            }`}
          >
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-pink-500/40 to-purple-600/40 flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-all">
                <HiMusicalNote size={isMobile ? 12 : 16} className="opacity-70" />
              </div>
            </div>
            <p className="text-xs sm:text-sm font-semibold line-clamp-1">
              {truncateText(track.name, textTrackTruncate)}
            </p>
            <p className="text-xs opacity-60 line-clamp-1">
              {truncateText(track.artist || 'Unknown', textArtistTruncate)}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
