import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { fetchAuthData } from '../api/auth.ts';
import GoogleIcon from '@mui/icons-material/Google';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await fetchAuthData().then(data => data.authStatus);
      if (authStatus) {
        navigate('/timesheet');
      }
    };
    checkAuth();
  }, []);

  const theme = useTheme();



  return (
    <>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '1em',
        }}>

        <Typography
          variant='h5'
          component="h2"
          sx={{
            display: 'flex',
            boxSizing: 'border-box',
            alignItems: 'center',
            fontFamily: 'Helvetica',
            marginBottom: '1.5em',
            borderBottom: '1px solid #ccc',
            paddingBottom: '0.7em !important',
            padding: '0 1em',
          }}>
          <CalendarMonthIcon
            sx={{
              marginRight: '0.2em',
              fontSize: '1.2em',
              padding: 0,
            }} />
          Timesheet Tracker
        </Typography>

        <Typography
          variant="h5"
          component="h1"
          sx={{
            display: 'flex',
            marginBottom: '0.5em',
            alignItems: 'left',
            fontWeight: 400,
            fontFamily: 'Helvetica',
          }}
        >
          Log in
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#f1f1f1',
            color: 'black',
            fontWeight: 600,
          }}
          onClick={() => {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
            window.location.href = `${baseUrl}/auth/google`;
          }}
        >
          <GoogleIcon style={{ marginRight: '1em', color: theme.palette.error.light }} />
          Continue with Google
        </Button>
      </Container>
    </>
  );
}

export default LoginPage;