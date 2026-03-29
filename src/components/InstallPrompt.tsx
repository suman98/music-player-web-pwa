import React, { useState, useEffect } from 'react'
import { MdDownload, MdClose } from 'react-icons/md'
import { promptInstall, setInstallPromptCallback, PwaInstallPrompt } from '../utils/pwaInstall'

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Listen for install prompt availability
    setInstallPromptCallback((prompt: PwaInstallPrompt) => {
      setShowPrompt(true)
    })
  }, [])

  const handleInstall = async () => {
    await promptInstall()
    setShowPrompt(false)
  }

  if (!showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-purple-100 to-purple-50 dark:from-purple-900/90 dark:to-purple-900/70 backdrop-blur-sm border-t border-gray-200 dark:border-white/10 p-4 sm:p-5 animate-slideUp shadow-2xl">
      <div className="max-w-md mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2.5 bg-purple-500/20 rounded-xl shadow-md">
            <MdDownload className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Install Music Player</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Play music offline anytime</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleInstall}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Install
          </button>
          <button
            onClick={() => setShowPrompt(false)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl transition-colors"
          >
            <MdClose className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  )
}
