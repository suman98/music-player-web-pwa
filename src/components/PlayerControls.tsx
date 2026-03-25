import { MdPlayArrow, MdPause, MdSkipNext, MdSkipPrevious, MdVolumeUp } from 'react-icons/md'

interface PlayerControlsProps {
  isPlaying: boolean
  onPlayPause: () => void
  onPrevious: () => void
  onNext: () => void
  onVolumeChange: (volume: number) => void
  volume: number
  isMobile?: boolean
}

export function PlayerControls({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  onVolumeChange,
  volume,
  isMobile,
}: PlayerControlsProps) {
  const buttonSize = isMobile ? 'w-7 h-7' : 'w-9 h-9'
  const buttonIconSize = isMobile ? 14 : 18
  const playButtonSize = isMobile ? 'w-12 h-12' : 'w-14 h-14'
  const playIconSize = isMobile ? 20 : 24

  return (
    <div className="flex flex-col gap-2">
      {/* Main controls */}
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        <button
          onClick={onPrevious}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center hover:shadow-lg transition-all duration-200 group"
          title="Previous track"
        >
          <MdSkipPrevious size={isMobile ? 16 : 20} className="group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={onPlayPause}
          className={`relative ${playButtonSize} rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl group hover:scale-105`}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all" />
          {isPlaying ? (
            <MdPause size={playIconSize} className="text-white group-hover:scale-110 transition-transform" />
          ) : (
            <MdPlayArrow size={playIconSize} className="text-white ml-1 group-hover:scale-110 transition-transform" />
          )}
        </button>

        <button
          onClick={onNext}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center hover:shadow-lg transition-all duration-200 group"
          title="Next track"
        >
          <MdSkipNext size={isMobile ? 16 : 20} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Volume control */}
      <div className="flex items-center gap-1.5 sm:gap-2 px-1.5">
        <MdVolumeUp size={16} className="opacity-70 flex-shrink-0" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => onVolumeChange(parseInt(e.target.value))}
          className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-gradient hover:accent-purple-400 transition-all"
        />
        <span className="text-xs opacity-70 w-4 sm:w-5 text-right flex-shrink-0 font-semibold">{volume}</span>
      </div>
    </div>
  )
}
