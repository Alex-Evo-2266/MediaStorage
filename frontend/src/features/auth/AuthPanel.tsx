
import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { supabase } from '../../shared/api/supabaseClient';

interface AuthPanelProps {
  sessionError?: string | null;
}

export function AuthPanel({ sessionError }: AuthPanelProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function signIn() {
    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось войти');
    } finally {
      setSubmitting(false);
    }
  }

  async function signUp() {
    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      setMessage(
        'Регистрация выполнена. Если требуется подтверждение, проверьте почту.',
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось зарегистрироваться');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        bgcolor: '#101418',
        px: 2,
        py: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 440,
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          bgcolor: '#1a2026',
          color: '#f3f5f7',
          border: '1px solid #2b333c',
        }}
      >
        <Stack spacing={2.5}>
          <Box>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 700 }}>
              Media Storage
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.75, color: '#aab4bf' }}>
              Войдите, чтобы открыть свою медиатеку
            </Typography>
          </Box>

          <TextField
            label="Электронная почта"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            fullWidth
            sx={{
              '& .MuiInputLabel-root': { color: '#aab4bf' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#90a8ff' },
              '& .MuiOutlinedInput-root': {
                color: '#f3f5f7',
                '& fieldset': { borderColor: '#46515d' },
                '&:hover fieldset': { borderColor: '#8292a3' },
              },
            }}
          />

          <TextField
            label="Пароль"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            fullWidth
            sx={{
              '& .MuiInputLabel-root': { color: '#aab4bf' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#90a8ff' },
              '& .MuiOutlinedInput-root': {
                color: '#f3f5f7',
                '& fieldset': { borderColor: '#46515d' },
                '&:hover fieldset': { borderColor: '#8292a3' },
              },
            }}
          />

          {sessionError && <Alert severity="error">{sessionError}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          {message && <Alert severity="info">{message}</Alert>}

          <Stack spacing={1.25}>
            <Button
              variant="contained"
              onClick={() => void signIn()}
              disabled={submitting || !email.trim() || !password}
              fullWidth
              size="large"
            >
              Войти
            </Button>

            <Button
              variant="outlined"
              onClick={() => void signUp()}
              disabled={submitting || !email.trim() || password.length < 6}
              fullWidth
              sx={{
                color: '#c8d2df',
                borderColor: '#46515d',
                '&:hover': { borderColor: '#8292a3' },
              }}
            >
              Зарегистрироваться
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
