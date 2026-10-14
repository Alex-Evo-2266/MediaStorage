import { AppBar, Box, InputAdornment, TextField, Toolbar, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

interface TopBarProps {
  title: string
  searchValue: string
  onSearchChange: (value: string) => void
}

export function TopBar({ title, searchValue, onSearchChange }: TopBarProps) {
  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        bgcolor: 'background.paper',
      }}
    >
      <Toolbar sx={{ gap: 2, justifyContent: 'space-between', flexWrap: 'wrap', py: 1.5 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>

        <Box sx={{ width: { xs: '100%', sm: 320 }, ml: 'auto' }}>
          <TextField
            fullWidth
            size="small"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Поиск по названию"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  )
}
