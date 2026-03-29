import { AudioTrack } from '@music-library/core'
import { HiMusicalNote } from 'react-icons/hi2'
import { truncateText } from '../utils'

interface LyricsDisplayProps {
  track: AudioTrack | null
  isMobile?: boolean
}

export function LyricsDisplay({ track, isMobile }: LyricsDisplayProps) {
  const padding = isMobile ? 'p-3' : 'p-4'
  const textSize = isMobile ? 'text-lg' : 'text-xl'
  const headingTextSize = isMobile ? 'text-xs' : 'text-sm'
  const coverSize = isMobile ? 'h-32' : 'h-48'

  return (
    <div className={`glass ${padding} flex flex-col ${isMobile ? 'gap-2' : 'gap-3'} h-full rounded-2xl shadow-lg border border-gray-200 dark:border-white/10`}>
      <h3 className={`${headingTextSize} font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent`}>Details</h3>

      {track ? (
        <div className="flex-1 overflow-hidden flex flex-col gap-3 sm:gap-4 pr-2">
          {/* Album cover placeholder */}
          <div className={`w-full ${coverSize} rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center border border-gray-300 dark:border-white/10 shadow-lg hover:shadow-xl transition-all`}>
            <HiMusicalNote size={isMobile ? 40 : 60} className="text-gray-400 dark:text-white/40" />
          </div>

          {/* Track info */}
          <div className="space-y-2 sm:space-y-3">
            <div>
              <p className={`${headingTextSize} text-gray-500 dark:text-white/70 uppercase tracking-widest text-xs mb-2 font-bold`}>
                Now Playing
              </p>
              <h2 className={`${textSize} font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent`}>
                {truncateText(track.name, isMobile ? 30 : 40)}
              </h2>
            </div>

            <div>
              <p className={`${headingTextSize} text-gray-500 dark:text-white/70 uppercase tracking-widest text-xs mb-2 font-bold`}>
                Artist
              </p>
              <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-white">
                {truncateText(track.artist || 'Unknown Artist', isMobile ? 35 : 50)}
              </p>
            </div>

            {/* Waveform visualization */}
            <div className="pt-2 sm:pt-4">
              <p className={`${headingTextSize} text-gray-500 dark:text-white/70 uppercase tracking-widest text-xs mb-3 font-bold`}>
                Waveform
              </p>
              <div className="waveform">
                {Array.from({ length: isMobile ? 12 : 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="waveform-bar"
                    style={{
                      animationDelay: `${i * 0.05}s`,
                      height: `${Math.random() * 60 + 40}%`,
                      background: 'linear-gradient(180deg, #ec4899 0%, #a855f7 100%)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-white/40">
          <div className="text-center">
            <HiMusicalNote size={40} className="mx-auto mb-3" />
            <p className="text-xs sm:text-sm font-medium">Select a track to see details</p>
          </div>
        </div>
      )}
    </div>
  )
}
