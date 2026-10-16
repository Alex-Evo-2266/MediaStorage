import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { getSafeErrorContext, logger } from './shared/lib/logger'
import { AppErrorBoundary } from './shared/ui/AppErrorBoundary'

window.addEventListener('error', (event) => {
  if (!(event instanceof ErrorEvent)) return

  logger.error('runtime.unhandled_error', {
    errorMessage: event.message,
    errorName:
      event.error instanceof Error ? event.error.name : 'UnknownError',
  })
})

window.addEventListener('unhandledrejection', (event) => {
  logger.error('runtime.unhandled_rejection', {
    ...getSafeErrorContext(event.reason),
    reasonType:
      event.reason === null ? 'null' : typeof event.reason,
  })
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppErrorBoundary>
  </StrictMode>,
)
