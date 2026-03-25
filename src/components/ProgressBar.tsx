import { formatTime } from '../utils'

interface ProgressBarProps {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
  isMobile?: boolean
}

export function ProgressBar({ currentTime, duration, onSeek, isMobile }: ProgressBarProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget
    const rect = bar.getBoundingClientRect()
    const percentage = (e.clientX - rect.left) / rect.width
    onSeek(percentage * duration)
  }

  return (
    <div className="w-full flex flex-col gap-1.5 sm:gap-2">
      <div
        onClick={handleClick}
        className="w-full h-1 sm:h-1.5 bg-white/10 rounded-full cursor-pointer group hover:h-1.5 sm:hover:h-2 transition-all"
      >
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        >
          <div className="float-right w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform -translate-y-0.5" />
        </div>
      </div>
      <div className={`flex justify-between ${isMobile ? 'text-xs' : 'text-xs'} opacity-60 px-1`}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
}
