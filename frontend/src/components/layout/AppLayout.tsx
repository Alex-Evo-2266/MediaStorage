import { Box, Stack } from '@mui/material'
import type { ReactNode } from 'react'

interface AppLayoutProps {
  sidebar: ReactNode
  topbar: ReactNode
  content: ReactNode
}

export function AppLayout({ sidebar, topbar, content }: AppLayoutProps) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ minHeight: '100vh' }}
      >
        {sidebar}

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {topbar}
          <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
            {content}
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}
