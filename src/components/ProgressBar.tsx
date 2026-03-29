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
    <div className="w-full flex flex-col gap-2">
      <div
        onClick={handleClick}
        className="w-full h-1.5 sm:h-2 bg-gray-300 dark:bg-white/10 rounded-lg cursor-pointer group hover:h-2 sm:hover:h-2.5 transition-all shadow-inner"
      >
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg transition-all shadow-md"
          style={{ width: `${progress}%` }}
        >
          <div className="float-right w-3 h-3 sm:w-3.5 sm:h-3.5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform -translate-y-0.5 transition-opacity" />
        </div>
      </div>
      <div className={`flex justify-between ${isMobile ? 'text-xs' : 'text-xs'} text-gray-600 dark:text-white/60 px-1 font-medium`}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
}
