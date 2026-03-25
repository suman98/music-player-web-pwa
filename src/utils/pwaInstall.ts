// PWA Service Worker Registration and Management

export interface PwaInstallPrompt extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferredPrompt: PwaInstallPrompt | null = null
let newWorker: ServiceWorker | null = null

export function registerServiceWorker() {
  if (!navigator.serviceWorker) {
    console.warn('[PWA] Service Workers not supported in this browser')
    return
  }

  navigator.serviceWorker
    .register('/sw.js', { scope: '/' })
    .then((registration) => {
      console.log('[PWA] ✅ Service Worker registered successfully')

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
      console.error('[PWA] ❌ Service Worker registration failed:', error)
    })
}

export function setupInstallPrompt() {
  // Log initial state
  console.log('[PWA] Setting up install prompt listener...')
  
  // Check if app is already installed
  if (isRunningAsApp()) {
    console.log('[PWA] App is already running as installed app')
    return
  }

  // Listen for the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    console.log('[PWA] ✅ beforeinstallprompt event fired - Install prompt AVAILABLE')
    e.preventDefault()
    deferredPrompt = e as PwaInstallPrompt
    notifyInstallPromptReady(deferredPrompt)
  })

  // Handle app installed event
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] ✅ App installed successfully')
    deferredPrompt = null
    notifyAppInstalled()
  })

  // Check PWA readiness and log manifest info
  setTimeout(() => {
    checkPwaReadiness()
  }, 1500)
}

function checkPwaReadiness() {
  console.log('[PWA] Checking PWA readiness...')
  
  // Check manifest
  const manifest = document.querySelector('link[rel="manifest"]')
  if (manifest) {
    const href = manifest.getAttribute('href')
    if (href) {
      console.log(`[PWA] ✅ Manifest found at: ${href}`)
      
      // Try to fetch and validate manifest
      fetch(href)
        .then(res => res.json())
        .then(data => {
          console.log('[PWA] ✅ Manifest is valid:', {
            name: data.name,
            icons: data.icons?.length || 0,
            displayMode: data.display,
          })
        })
        .catch(err => {
          console.error('[PWA] ❌ Manifest fetch/parse error:', err)
        })
    }
  } else {
    console.warn('[PWA] ⚠️ Manifest link not found in HTML')
  }

  // Check if browsing over HTTPS (required for PWA)
  const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost'
  if (isSecure) {
    console.log('[PWA] ✅ Secure context (HTTPS or localhost)')
  } else {
    console.warn('[PWA] ⚠️ Not served over HTTPS - Install prompt may not appear')
  }

  // Check service worker
  if (navigator.serviceWorker?.controller) {
    console.log('[PWA] ✅ Service Worker is active and controlling the page')
  } else {
    console.log('[PWA] ⏳ Service Worker registering or not yet controlling page')
  }
}

export function promptInstall() {
  if (!deferredPrompt) {
    console.warn('[PWA] Install prompt not available')
    return Promise.resolve()
  }

  return deferredPrompt
    .prompt()
    .then(() => {
      return deferredPrompt!.userChoice
    })
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] ✅ User accepted install prompt')
      } else {
        console.log('[PWA] User dismissed install prompt')
      }
      deferredPrompt = null
    })
    .catch((error) => {
      console.error('[PWA] ❌ Install prompt error:', error)
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

// Callbacks for UI updates
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
