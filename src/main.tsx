import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { registerServiceWorker, setupInstallPrompt } from './utils/pwaInstall'
import { ThemeProvider } from './contexts/ThemeContext'

// Register Service Worker for offline support
registerServiceWorker()

// Setup PWA install prompt
setupInstallPrompt()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
