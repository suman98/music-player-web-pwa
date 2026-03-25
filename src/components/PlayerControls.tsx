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
  const buttonSize = isMobile ? 'w-8 h-8' : 'w-10 h-10'
  const buttonIconSize = isMobile ? 16 : 20
  const playButtonSize = isMobile ? 'w-14 h-14' : 'w-16 h-16'
  const playIconSize = isMobile ? 24 : 28

  return (
    <div className={`flex flex-col gap-${isMobile ? '3' : '6'}`}>
      {/* Main controls */}
      <div className="flex items-center justify-center gap-3 sm:gap-6">
        <button
          onClick={onPrevious}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center hover:shadow-lg transition-all duration-200 group"
          title="Previous track"
        >
          <MdSkipPrevious size={isMobile ? 20 : 24} className="group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={onPlayPause}
          className={`relative ${playButtonSize} rounded-full bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 flex items-center justify-center transition-all duration-200 shadow-xl hover:shadow-2xl group hover:scale-105`}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-all" />
          {isPlaying ? (
            <MdPause size={playIconSize} className="text-white group-hover:scale-110 transition-transform" />
          ) : (
            <MdPlayArrow size={playIconSize} className="text-white ml-1 group-hover:scale-110 transition-transform" />
          )}
        </button>

        <button
          onClick={onNext}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center hover:shadow-lg transition-all duration-200 group"
          title="Next track"
        >
          <MdSkipNext size={isMobile ? 20 : 24} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Volume control */}
      <div className="flex items-center gap-2 sm:gap-2 px-1.5">
        <MdVolumeUp size={20} className="opacity-70 flex-shrink-0" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => onVolumeChange(parseInt(e.target.value))}
          className="flex-1 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-gradient hover:accent-purple-400 transition-all"
        />
        <span className="text-xs opacity-70 w-5 sm:w-6 text-right flex-shrink-0 font-semibold">{volume}</span>
      </div>
    </div>
  )
}
