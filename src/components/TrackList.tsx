import { useState } from 'react'
import { AudioTrack } from '@music-library/core'
import { HiMusicalNote } from 'react-icons/hi2'
import { MdPlayArrow, MdFavoriteBorder, MdSearch } from 'react-icons/md'
import { truncateText, formatTime } from '../utils'

interface TrackListProps {
  tracks: AudioTrack[]
  onTrackClick: (track: AudioTrack) => void
  currentTrack: AudioTrack | null
  isPlaying: boolean
  currentTime?: number
  duration?: number
  isMobile?: boolean
}

export function TrackList({
  tracks,
  onTrackClick,
  currentTrack,
  isPlaying,
  currentTime = 0,
  duration = 0,
  isMobile,
}: TrackListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const padding = isMobile ? 'p-3' : 'p-4'
  const gap = isMobile ? 'gap-2' : 'gap-2'
  const trackPadding = isMobile ? 'p-2' : 'p-2.5'
  const textTruncate = isMobile ? 18 : 25
  const iconSize = isMobile ? 16 : 20

  const filteredTracks = tracks.filter(
    (track) =>
      track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (track.artist && track.artist.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className={`glass-sm ${padding} flex-1 flex flex-col`}>
      {/* Search input */}
      <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-white/5 rounded-lg flex-shrink-0">
        <MdSearch size={18} className="opacity-60" />
        <input
          type="text"
          placeholder="Search tracks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-xs sm:text-sm outline-none placeholder-white/40 text-white"
        />
      </div>

      <div className={`flex-1 min-h-0 overflow-y-auto space-y-0 pr-2 -mx-2`}>
        {filteredTracks.length === 0 ? (
          <div className="flex items-center justify-center h-full opacity-40">
            <div className="text-center">
              <HiMusicalNote size={40} className="mx-auto mb-2" />
              <p className="text-xs sm:text-sm">{searchQuery ? 'No matches found' : 'No tracks loaded'}</p>
              <p className="text-xs opacity-60 mt-1">{searchQuery ? 'Try a different search' : 'Select a folder to load music'}</p>
            </div>
          </div>
        ) : (
          [...filteredTracks, ...filteredTracks, ...filteredTracks, ...filteredTracks, ...filteredTracks, ...filteredTracks ,...filteredTracks, ...filteredTracks].map((track, idx) => (
            <button
              key={idx}
              onClick={() => onTrackClick(track)}
              className={`w-full text-left ${trackPadding} transition-all duration-300 group ${
                currentTrack?.name === track.name
                  ? 'glass-sm ring-2 ring-purple-500'
                  : 'glass-sm hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`relative w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-500/30 to-purple-600/30 flex items-center justify-center flex-shrink-0 text-xs font-semibold`}>
                  {currentTrack?.name === track.name && isPlaying ? (
                    <MdPlayArrow size={isMobile ? 12 : 14} className="fill-white" />
                  ) : (
                    <span className="opacity-60">{idx + 1}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate">
                    {truncateText(track.name, textTruncate)}
                  </p>
                  <p className="text-xs opacity-60 truncate">
                    {truncateText(track.artist || 'Unknown', textTruncate)}
                  </p>
                </div>

                {currentTrack?.name === track.name && !isMobile && (
                  <span className="text-xs opacity-60 flex-shrink-0 whitespace-nowrap">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                >
                  <MdFavoriteBorder size={iconSize} className="hover:fill-red-500 hover:text-red-500 transition-colors" />
                </button>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
