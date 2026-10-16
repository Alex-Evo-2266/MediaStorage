
import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../shared/api/supabaseClient';

export function AuthPanel() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;

      if (error) setError(error.message);
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted) setSession(newSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signIn() {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось войти');
    } finally {
      setLoading(false);
    }
  }

  async function signUp() {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        setMessage('Регистрация успешна. Вы вошли в систему.');
      } else {
        setMessage(
          'Регистрация выполнена. Проверьте почту для подтверждения аккаунта.',
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось зарегистрироваться');
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось выйти');
    } finally {
      setLoading(false);
    }
  }

  if (loading && !session) {
    return <CircularProgress />;
  }

  if (session) {
    return (
      <Stack spacing={2} component="div">
        <Typography variant="h6">Вы авторизованы</Typography>
        <Typography>Пользователь: {session.user.email}</Typography>
        <Button
          variant="outlined"
          onClick={signOut}
          disabled={loading}
        >
          Выйти
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
    );
  }

  return (
    <Box sx={{ maxWidth: 400, width: '100%' }}>
      <Stack spacing={2}>
        <Typography variant="h5">Вход в Media Storage</Typography>

        <TextField
          label="Электронная почта"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
          fullWidth
        />

        <TextField
          label="Пароль"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          fullWidth
        />

        {error && <Alert severity="error">{error}</Alert>}
        {message && <Alert severity="info">{message}</Alert>}

        <Button
          variant="contained"
          onClick={signIn}
          disabled={loading || !email.trim() || !password}
        >
          Войти
        </Button>

        <Button
          variant="outlined"
          onClick={signUp}
          disabled={loading || !email.trim() || password.length < 6}
        >
          Зарегистрироваться
        </Button>
      </Stack>
    </Box>
  );
}
