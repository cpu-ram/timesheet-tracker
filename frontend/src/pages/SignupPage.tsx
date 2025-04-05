import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Container, TextField, Button } from '@mui/material/';
import { fetchAuthData } from '../api/auth';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const SignupPage = ({ setIsSignedUp, setIsAuthenticated }) => {
  const [enteredName, setEnteredName] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const data = await fetchAuthData();
      if (data.signUpCompletionStatus) {
        navigate('/timesheet');
      }
    };
    getData().catch(error => console.error('Error fetching auth data:', error));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const queryResult = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/employees/current/complete-signup`,
        {
          method: 'PATCH',
          credentials: 'include',
          body: JSON.stringify({ name: enteredName }),
          headers: {
            'Content-Type': 'application/json',
          }
        });
      if (queryResult.ok) {
        setIsSignedUp(true);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error updating name:', error);
    }
  };

  return (
    <Container
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h6"
        component="h2"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          boxSizing: 'border-box',
          fontFamily: 'Helvetica',
          marginBottom: '3em',
          borderBottom: '1px solid #ccc',
          padding: '0.5em 4em !important',
          width: 'auto',
          whiteSpace: 'nowrap',
        }}
      >
        <CalendarMonthIcon
          sx={{
            marginRight: '0.2em',
            fontSize: '1.2em',
            padding: 0,
          }}
        />
        Timesheet Tracker
      </Typography>

      <Typography
        variant="h6"
        sx={{ color: 'grey.600', fontWeight: '600' }}
      >

      </Typography>

      <Typography
        variant="h5"
        sx={{ color: 'black', fontWeight: '600' }}
      >
        Please enter your name
      </Typography>

      <TextField
        variant="outlined"
        label="Full Name"
        value={enteredName}
        onChange={(event) => setEnteredName(event.target.value)}
        sx={{ marginTop: '2em', minWidth: '18em' }}
      />

      <Button
        variant="contained"
        sx={{ marginTop: '2em', padding: '0.5em 4em', minWidth: '18em' }}
        type="submit"
      >
        Submit
      </Button>
    </Container>
  );
};

export default SignupPage;