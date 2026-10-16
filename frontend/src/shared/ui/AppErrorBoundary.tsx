import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import { logger } from '../lib/logger'

interface AppErrorBoundaryProps {
  children: ReactNode
}

interface AppErrorBoundaryState {
  hasError: boolean
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, _errorInfo: ErrorInfo): void {
    logger.error('react.render.error', {
      errorName: error.name,
      errorMessage: error.message,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3 }}>
          <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
            <Alert severity="error">
              Произошла непредвиденная ошибка приложения.
            </Alert>
            <Typography variant="body2">
              Обновите страницу. Если проблема повторится, обратитесь в поддержку.
            </Typography>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Обновить страницу
            </Button>
          </Stack>
        </Box>
      )
    }

    return this.props.children
  }
}
