// PWA Service Worker Registration and Management

export interface PwaInstallPrompt extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferredPrompt: PwaInstallPrompt | null = null
let newWorker: ServiceWorker | null = null

export function registerServiceWorker() {
  if (!navigator.serviceWorker) {
    console.log('Service Workers not supported')
    return
  }

  navigator.serviceWorker
    .register('/sw.js', { scope: '/' })
    .then((registration) => {
      console.log('Service Worker registered successfully:', registration)

      // Check for updates periodically
      setInterval(() => {
        registration.update()
      }, 1000 * 60 * 60) // Check every hour

      // Listen for new service worker
      registration.addEventListener('updatefound', () => {
        const newWorkerInstance = registration.installing
        if (newWorkerInstance) {
          newWorker = newWorkerInstance
          newWorkerInstance.addEventListener('statechange', () => {
            if (newWorkerInstance.state === 'activated') {
              handleNewServiceWorker()
            }
          })
        }
      })
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error)
    })
}

export function setupInstallPrompt() {
  // Listen for the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault()
    deferredPrompt = e as PwaInstallPrompt
    // Show install button/prompt in your UI
    notifyInstallPromptReady(deferredPrompt)
  })

  // Handle app installed event
  window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully')
    deferredPrompt = null
    notifyAppInstalled()
  })
}

export function promptInstall() {
  if (!deferredPrompt) {
    console.log('Install prompt not available')
    return Promise.resolve()
  }

  return deferredPrompt
    .prompt()
    .then(() => {
      return deferredPrompt!.userChoice
    })
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted install prompt')
      } else {
        console.log('User dismissed install prompt')
      }
      deferredPrompt = null
    })
    .catch((error) => {
      console.error('Install prompt error:', error)
      deferredPrompt = null
    })
}

export function handleNewServiceWorker() {
  const confirmUpdate = confirm(
    'A new version of Music Player is available! Reload to update?'
  )
  if (confirmUpdate && newWorker) {
    newWorker.postMessage({ type: 'SKIP_WAITING' })
    window.location.reload()
  }
}

export function isInstallable(): boolean {
  return deferredPrompt !== null
}

export function isRunningAsApp(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // @ts-ignore
    (navigator.standalone === true) ||
    document.referrer.includes('android-app://')
  )
}

// Callbacks for UI updates (implement in your app)
let onInstallPromptReady: ((prompt: PwaInstallPrompt) => void) | null = null
let onAppInstalled: (() => void) | null = null

export function setInstallPromptCallback(callback: (prompt: PwaInstallPrompt) => void) {
  onInstallPromptReady = callback
}

export function setAppInstalledCallback(callback: () => void) {
  onAppInstalled = callback
}

function notifyInstallPromptReady(prompt: PwaInstallPrompt) {
  if (onInstallPromptReady) {
    onInstallPromptReady(prompt)
  }
}

function notifyAppInstalled() {
  if (onAppInstalled) {
    onAppInstalled()
  }
}
