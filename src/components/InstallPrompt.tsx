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
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/90 to-purple-900/70 backdrop-blur-sm border-t border-white/10 p-4 sm:p-5 animate-slideUp">
      <div className="max-w-md mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2.5 bg-purple-500/20 rounded-lg">
            <MdDownload className="w-5 h-5 text-purple-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white">Install Music Player</p>
            <p className="text-xs text-gray-400">Play music offline anytime</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleInstall}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Install
          </button>
          <button
            onClick={() => setShowPrompt(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <MdClose className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  )
}
