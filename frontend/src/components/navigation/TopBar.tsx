import {
  AppBar,
  Avatar,
  Box,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
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
        bgcolor: '#f5f7fa',
        borderBottom: '1px solid #dde3ea',
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          gap: { xs: 1.5, md: 2 },
          px: { xs: 2, md: 3 },
          py: { xs: 1.25, md: 1.4 },
          minHeight: { xs: 86, md: 72 },
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography component="h1" sx={{ fontWeight: 700, color: '#1c2330', lineHeight: 1.2, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
            {title}
          </Typography>
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{ alignItems: { xs: 'stretch', sm: 'center' }, ml: 'auto', width: { xs: '100%', sm: 'auto' } }}
        >
          <TextField
            size="small"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Поиск по медиатеке"
            sx={{ width: { xs: '100%', sm: 320, md: 340 }, maxWidth: '100%' }}
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

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'flex-end', ml: { xs: 0, sm: 1 } }}>
            <Typography variant="caption" sx={{ color: '#4c5d74', whiteSpace: 'nowrap' }}>
              Сортировка: по дате
            </Typography>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#dfe7ff', color: '#1d4ed8', fontSize: 12 }}>А</Avatar>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
