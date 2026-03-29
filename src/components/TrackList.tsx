import { useState, useEffect } from 'react'
import { AudioTrack } from '@music-library/core'
import { HiMusicalNote } from 'react-icons/hi2'
import { MdPlayArrow, MdFavoriteBorder, MdSearch, MdDragIndicator } from 'react-icons/md'
import { truncateText, formatTime } from '../utils'

interface TrackListProps {
  tracks: AudioTrack[]
  onTrackClick: (track: AudioTrack) => void
  onTracksReorder?: (tracks: AudioTrack[]) => void
  currentTrack: AudioTrack | null
  isPlaying: boolean
  currentTime?: number
  duration?: number
  isMobile?: boolean
}

export function TrackList({
  tracks,
  onTrackClick,
  onTracksReorder,
  currentTrack,
  isPlaying,
  currentTime = 0,
  duration = 0,
  isMobile,
}: TrackListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [displayTracks, setDisplayTracks] = useState(tracks)

  // Sync displayTracks when tracks prop changes
  useEffect(() => {
    setDisplayTracks(tracks)
  }, [tracks.length]) // Only update if count changes to preserve order
  const padding = isMobile ? 'p-3' : 'p-4'
  const gap = isMobile ? 'gap-2' : 'gap-2'
  const trackPadding = isMobile ? 'p-2' : 'p-2.5'
  const textTruncate = isMobile ? 18 : 25
  const iconSize = isMobile ? 16 : 20

  const filteredTracks = displayTracks.filter(
    (track) =>
      track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (track.artist && track.artist.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) return

    const newTracks = [...displayTracks]
    const draggedTrack = newTracks[draggedIndex]
    newTracks.splice(draggedIndex, 1)
    newTracks.splice(dropIndex, 0, draggedTrack)
    
    setDisplayTracks(newTracks)
    setDraggedIndex(null)
    onTracksReorder?.(newTracks)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <div className={`glass-sm ${padding} flex-1 flex flex-col rounded-2xl`}>
      {/* Search input */}
      <div className="flex items-center gap-2 mb-3 px-3 py-2.5 bg-gray-100 dark:bg-white/5 rounded-xl flex-shrink-0 shadow-sm">
        <MdSearch size={20} className="text-gray-500 dark:text-white/60" />
        <input
          type="text"
          placeholder="Search tracks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-xs sm:text-sm outline-none placeholder-gray-400 dark:placeholder-white/40 text-gray-900 dark:text-white"
        />
      </div>

      <div className={`flex-1 min-h-0 overflow-y-auto space-y-1 pr-2 -mx-2`}>
        {filteredTracks.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-white/40">
            <div className="text-center">
              <HiMusicalNote size={48} className="mx-auto mb-3" />
              <p className="text-sm sm:text-base font-medium">{searchQuery ? 'No matches found' : 'No tracks loaded'}</p>
              <p className="text-xs opacity-60 mt-1">{searchQuery ? 'Try a different search' : 'Select a folder to load music'}</p>
            </div>
          </div>
        ) : (
          [...filteredTracks].map((track, idx) => (
            <button
              key={idx}
              draggable={!isMobile}
              style={!isMobile ? ({ 
                WebkitUserSelect: 'none',
                userSelect: 'none'
              } as React.CSSProperties) : undefined}
              onDragStart={!isMobile ? (e) => handleDragStart(e, idx) : undefined}
              onDragOver={!isMobile ? handleDragOver : undefined}
              onDrop={!isMobile ? (e) => handleDrop(e, idx) : undefined}
              onDragEnd={!isMobile ? handleDragEnd : undefined}
              onClick={() => onTrackClick(track)}
              className={`w-full text-left ${trackPadding} rounded-xl transition-all duration-300 group ${
                !isMobile && draggedIndex === idx ? 'opacity-50 bg-purple-500/20' : ''
              } ${
                currentTrack?.name === track.name
                  ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 ring-2 ring-purple-500 shadow-md'
                  : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10'
              } ${isMobile ? 'cursor-pointer' : 'cursor-move'}`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                {!isMobile && <MdDragIndicator size={20} className="text-gray-400 dark:text-white/40 flex-shrink-0 hover:text-gray-600 dark:hover:text-white/100 transition-colors" />}
                <div className={`relative w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-500/30 to-purple-600/30 flex items-center justify-center flex-shrink-0 text-xs font-semibold rounded-lg shadow-sm`}>
                  {currentTrack?.name === track.name && isPlaying ? (
                    <MdPlayArrow size={isMobile ? 14 : 16} className="fill-white" />
                  ) : (
                    <span className="text-gray-700 dark:text-white/60">{idx + 1}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate text-gray-900 dark:text-white">
                    {truncateText(track.name, textTruncate)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-white/60 truncate">
                    {truncateText(track.artist || 'Unknown', textTruncate)}
                  </p>
                </div>

                {currentTrack?.name === track.name && !isMobile && (
                  <span className="text-xs text-gray-500 dark:text-white/60 flex-shrink-0 whitespace-nowrap">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                >
                  <MdFavoriteBorder size={iconSize} className="text-gray-500 dark:text-white/60 hover:fill-red-500 hover:text-red-500 transition-colors" />
                </button>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
