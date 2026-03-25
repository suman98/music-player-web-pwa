const CACHE_NAME = 'music-player-v1'
const RUNTIME_CACHE = 'music-player-runtime'

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/music.svg',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Silently fail if some assets are not available during install
        console.log('Some static assets could not be cached during install')
      })
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME && name !== RUNTIME_CACHE) {
            return caches.delete(name)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Handle API requests differently if needed
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request).then((response) => {
        // Cache successful API responses
        if (response.ok) {
          const cache = caches.open(RUNTIME_CACHE)
          cache.then((c) => c.put(request, response.clone()))
        }
        return response
      }).catch(() => {
        // Return cached response if offline
        return caches.match(request)
      })
    )
    return
  }

  // For all other requests, try network first, fall back to cache
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version
        return cachedResponse
      }

      return fetch(request).then((response) => {
        // Don't cache failed requests
        if (!response || response.status !== 200) {
          return response
        }

        // Cache successful responses
        const responseToCache = response.clone()
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseToCache)
        })

        return response
      }).catch(() => {
        // Return a custom offline page if available
        return caches.match('/index.html')
      })
    })
  )
})

// Handle messages from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
