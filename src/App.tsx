import { useState, useEffect, useRef } from 'react'
import { createMusicLibrary, MusicLibrary, AudioTrack } from '@music-library/core'
import { MdFolderOpen, MdPlayArrow, MdPause, MdSkipNext, MdSkipPrevious, MdLightMode, MdDarkMode } from 'react-icons/md'
import { HiMusicalNote } from 'react-icons/hi2'
import { FaYoutube } from 'react-icons/fa'

import { CurrentlyPlaying } from './components/CurrentlyPlaying'
import { PlayerControls } from './components/PlayerControls'
import { ProgressBar } from './components/ProgressBar'
import { RecentlyPlayed } from './components/RecentlyPlayed'
import { YouMightLike } from './components/YouMightLike'
import { LyricsDisplay } from './components/LyricsDisplay'
import { TrackList } from './components/TrackList'
import { InstallPrompt } from './components/InstallPrompt'
import { YouTubeModal } from './components/YouTubeModal'
import { getTrackSrc, truncateText } from './utils'
import { updateMediaSession, registerMediaSessionHandlers, clearMediaSession } from './utils/mediaSession'
import { useTheme } from './contexts/ThemeContext'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const [library, setLibrary] = useState<MusicLibrary | null>(null)
  const [tracks, setTracks] = useState<AudioTrack[]>([])
  const [sortedTracks, setSortedTracks] = useState<AudioTrack[]>([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const [isLoading, setIsLoading] = useState(true)
  const [autoplay, setAutoplay] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Load sorted tracks from localStorage
  useEffect(() => {
    const savedSortOrder = localStorage.getItem('trackSortOrder')
    if (savedSortOrder) {
      try {
        const sortedIndices = JSON.parse(savedSortOrder)
        if (Array.isArray(sortedIndices)) {
          setSortedTracks(sortedIndices.map((idx) => tracks[idx]).filter(Boolean))
        }
      } catch (err) {
        console.error('Failed to load sort order:', err)
      }
    }
  }, [])

  // Initialize library
  useEffect(() => {
    const initLibrary = async () => {
      try {
        const musicLib = await createMusicLibrary({
          debugMode: true,
          autoRestoreLast: true,
        })
        setLibrary(musicLib)
        // Load tracks from auto-restored folder if available
        if (musicLib.tracks && musicLib.tracks.length > 0) {
          setTracks(musicLib.tracks)
          // Check if we have a saved sort order
          const savedSortOrder = localStorage.getItem('trackSortOrder')
          if (savedSortOrder) {
            try {
              const sortedIndices = JSON.parse(savedSortOrder)
              if (Array.isArray(sortedIndices) && sortedIndices.length === musicLib.tracks.length) {
                const sorted = sortedIndices.map((idx: number) => musicLib.tracks[idx])
                setSortedTracks(sorted)
              } else {
                setSortedTracks(musicLib.tracks)
              }
            } catch (err) {
              setSortedTracks(musicLib.tracks)
            }
          } else {
            setSortedTracks(musicLib.tracks)
          }
        }
      } catch (err) {
        console.error('Failed to initialize library:', err)
        setError('Failed to initialize music library')
      } finally {
        setIsLoading(false)
      }
    }
    initLibrary()
  }, [])

  // Create audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.volume = volume / 100
    }
  }, [])

  // Handle track changes
  useEffect(() => {
    if (currentTrackIndex !== null && tracks[currentTrackIndex]) {
      const track = tracks[currentTrackIndex]
      if (audioRef.current) {
        audioRef.current.src = getTrackSrc(track)
      }
    }
  }, [currentTrackIndex, tracks])

  // Handle play/pause state changes - dedicated effect for audio playback
  useEffect(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      // Attempt to play audio
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('[Audio] Play command issued but may need user interaction:', error)
        })
      }
    } else {
      // Pause audio
      audioRef.current.pause()
    }
  }, [isPlaying])

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleEnded = () => {
      if (autoplay) {
        // Auto-play next track
        setIsPlaying(true)
        if (currentTrackIndex !== null && currentTrackIndex < tracks.length - 1) {
          setCurrentTrackIndex(currentTrackIndex + 1)
        } else {
          // Loop back to start
          setCurrentTrackIndex(0)
        }
      } else {
        // Manual mode: stop at the end
        if (currentTrackIndex !== null && currentTrackIndex < tracks.length - 1) {
          setCurrentTrackIndex(currentTrackIndex + 1)
        } else {
          setIsPlaying(false)
        }
      }
    }
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [currentTrackIndex, tracks, autoplay])

  const handleLoadFolder = async () => {
    if (!library) return
    setIsLoading(true)
    setError(null)
    try {
      const loadedTracks = await library.load()
      setTracks(loadedTracks)
      setSortedTracks(loadedTracks)
      localStorage.removeItem('trackSortOrder')
      if (loadedTracks.length > 0) {
        setCurrentTrackIndex(0)
      }
    } catch (err) {
      console.error('Failed to load folder:', err)
      setError('Failed to load music folder. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTracksReorder = (reorderedTracks: AudioTrack[]) => {
    setSortedTracks(reorderedTracks)
    // Save the sort order as indices
    const sortOrder = reorderedTracks.map((track) => tracks.findIndex((t) => t.name === track.name && t.artist === track.artist))
    localStorage.setItem('trackSortOrder', JSON.stringify(sortOrder))
  }

  const handlePlayPause = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(console.error)
    }
  }

  const handlePrevious = () => {
    if (currentTrackIndex === null || currentTrackIndex === 0) {
      setCurrentTrackIndex(tracks.length - 1)
    } else {
      setCurrentTrackIndex(currentTrackIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentTrackIndex === null) {
      setCurrentTrackIndex(0)
    } else if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1)
    } else {
      setCurrentTrackIndex(0)
    }
  }

  const handleTrackClick = (track: AudioTrack) => {
    const index = tracks.findIndex((t) => t.name === track.name)
    if (index !== -1) {
      setCurrentTrackIndex(index)
      setIsPlaying(true)
    }
  }

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const handleYouTubeDownload = async (url: string) => {
    setIsDownloading(true)
    try {
      const response = await fetch('http://localhost:8000/download-youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Download failed')
      }

      // Get the filename from the response headers
      const contentDisposition = response.headers.get('content-disposition')
      console.log('Content-Disposition header:', contentDisposition)
      
      let filename = 'test-audio.mp3'
      
      if (contentDisposition) {
        // Try multiple regex patterns to extract filename
        let filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
        if (!filenameMatch) {
          filenameMatch = contentDisposition.match(/filename\*=UTF-8''(.+)/)
        }
        if (!filenameMatch) {
          filenameMatch = contentDisposition.match(/filename=([^;]+)/)
        }
        
        if (filenameMatch) {
          filename = filenameMatch[1]
          // Remove quotes if present
          filename = filename.replace(/^"|"$/g, '')
          console.log('Extracted filename:', filename)
        }
      }

      // Convert response to blob and download
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(downloadUrl)

      setIsYouTubeModalOpen(false)
      setError(null)
    } catch (err) {
      console.error('YouTube download error:', err)
      setError('Failed to download video. Please check the server is running.')
    } finally {
      setIsDownloading(false)
    }
  }

  // Register media session handlers for lock screen controls
  useEffect(() => {
    registerMediaSessionHandlers({
      onPlay: () => {
        if (audioRef.current && audioRef.current.paused && currentTrackIndex !== null) {
          audioRef.current.play().catch(console.error)
        }
      },
      onPause: () => {
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause()
        }
      },
      onNext: handleNext,
      onPrevious: handlePrevious,
      onSeek: handleSeek,
    })
  }, [])

  // Update media session metadata when track or playback state changes
  useEffect(() => {
    const currentTrack = currentTrackIndex !== null ? tracks[currentTrackIndex] : null
    
    if (currentTrack) {
      updateMediaSession(currentTrack, isPlaying, currentTime, duration)
    } else {
      clearMediaSession()
    }
  }, [currentTrackIndex, tracks, isPlaying, currentTime, duration])

  const currentTrack = currentTrackIndex !== null ? tracks[currentTrackIndex] : null

  if (isLoading && !library) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1a1a2e] dark:to-[#0f0f1e]">
        <div className="text-center">
          <HiMusicalNote size={64} className="mx-auto mb-4 text-purple-500 animate-bounce" />
          <p className="text-xl text-gray-800 dark:text-white">Loading Music Library...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1a1a2e] dark:to-[#0f0f1e] flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="glass border-b border-gray-200 dark:border-white/10 px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg">
            <HiMusicalNote size={24} className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">Music Player</h1>
            {isPlaying && currentTrack && (
              <p className="text-xs text-green-500 dark:text-green-400 font-medium truncate">▶ {truncateText(currentTrack.name, 20)}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => setIsYouTubeModalOpen(true)}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-500 hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
            title="Download YouTube video as MP3"
          >
            <FaYoutube size={20} className="text-white" />
          </button>
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition-all duration-300 shadow-md hover:shadow-lg"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <MdLightMode size={20} className="text-yellow-400" /> : <MdDarkMode size={20} className="text-gray-700" />}
          </button>
          <button
            onClick={() => setAutoplay(!autoplay)}
            className={`flex items-center justify-center gap-1 px-3 py-2 rounded-xl font-semibold transition-all duration-300 text-xs flex-shrink-0 shadow-md hover:shadow-lg ${
              autoplay
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                : 'bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-700 dark:text-white'
            }`}
            title={autoplay ? 'Autoplay enabled' : 'Autoplay disabled'}
          >
            <span>🔁</span>
            <span className="hidden sm:inline">{autoplay ? 'Auto' : 'Manual'}</span>
          </button>
          <button
            onClick={handleLoadFolder}
            disabled={!library || isLoading}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs text-white flex-shrink-0 shadow-md hover:shadow-lg"
          >
            <MdFolderOpen size={18} />
            <span className="hidden sm:inline">{isLoading ? 'Loading...' : 'Load'}</span>
          </button>
        </div>
      </header>

      {error && (
        <div className="bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/50 text-red-700 dark:text-red-200 px-4 sm:px-8 py-2 sm:py-3 text-xs sm:text-sm flex-shrink-0">
          {error}
        </div>
      )}

      {/* Main content - With padding for fixed footer */}
      <div className={`flex-1 overflow-hidden flex flex-col lg:flex-row gap-4 sm:gap-5 p-3 sm:p-5 ${currentTrack ? 'pb-28 sm:pb-32' : ''}`}>
        {/* Left sidebar - Hidden on mobile, visible on lg+ */}
        <div className="hidden lg:flex lg:w-80 lg:flex-col lg:gap-5 lg:overflow-hidden">
          <RecentlyPlayed
            tracks={tracks.slice(0, 5)}
            onTrackClick={handleTrackClick}
            currentTrack={currentTrack}
          />
          <YouMightLike
            tracks={tracks.slice(5)}
            onTrackClick={handleTrackClick}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
          />
        </div>

        {/* Center panel - Main responsive content */}
        <div className="flex-1 flex flex-col gap-3 sm:gap-4 min-w-0 min-h-0 lg:overflow-visible">
          {/* Desktop: Show player above playlist */}
          {currentTrack && (
            <div className="hidden lg:block">
              <CurrentlyPlaying track={currentTrack} isPlaying={isPlaying} />
            </div>
          )}

          {/* Playlist view */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <TrackList
              tracks={sortedTracks}
              onTrackClick={handleTrackClick}
              onTracksReorder={handleTracksReorder}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              isMobile
            />
          </div>

          {/* Desktop: Show playlist below player */}
          <div className="hidden lg:flex lg:flex-1 lg:min-h-0 lg:-mx-4">
            <TrackList
              tracks={sortedTracks}
              onTrackClick={handleTrackClick}
              onTracksReorder={handleTracksReorder}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
            />
          </div>
        </div>

        {/* Right sidebar - Hidden on mobile, visible on lg+ */}
        <div className="hidden lg:block lg:w-80 lg:min-h-0 lg:overflow-hidden">
          <LyricsDisplay track={currentTrack} />
        </div>
      </div>
      {/* Fixed Footer - Player Controls */}
      {currentTrack && (
        <footer className="fixed bottom-0 left-0 right-0 glass border-t border-gray-200 dark:border-white/10 px-4 sm:px-6 py-3 sm:py-4 shadow-2xl backdrop-blur-xl">
          <div className="max-w-full mx-auto flex flex-col gap-2.5">
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
            />
            <PlayerControls
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onVolumeChange={setVolume}
              volume={volume}
              isMobile
            />
          </div>
        </footer>
      )}
      {/* Install Prompt */}
      <InstallPrompt />
      {/* YouTube Modal */}
      <YouTubeModal
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
        onDownload={handleYouTubeDownload}
        isLoading={isDownloading}
      />
      {/* Hidden audio element */}
      <audio ref={audioRef} />
    </div>
  )
}
