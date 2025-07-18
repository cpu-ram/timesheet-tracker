import { useState } from 'react';
import { Typography, TextField, Button, Box } from '@mui/material/';
import { useAuthContext } from '../contexts/AuthContext.tsx';
import Navigation from '../components/Navigation/Navigation.tsx';

const ChangeNamePage = () => {
  const [enteredName, setEnteredName] = useState<string>('');
  const [nameChanged, setNameChanged] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { username, setUsername } = useAuthContext();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (enteredName.length < 1) {
      setError("Please enter a name");
      return;
    }
    try {
      const queryResult = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/employees/current/complete-signup`,
        {
          method: 'PATCH',
          credentials: 'include',
          body: JSON.stringify({ name: (enteredName || "") }),
          headers: {
            'Content-Type': 'application/json',
          }
        });
      if (queryResult.ok) {
        setError(null);
        setNameChanged(true);
        setUsername(enteredName);
      }
      else {
        throw new Error('Failure to update name: ' + queryResult.statusText);
      }
    } catch (error: unknown) {
      console.error(error);
      if(error instanceof Error) setError(error.toString());
      setNameChanged(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex !important',
        width: '100vw',
      }}>

      <Navigation />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: '100%',
          paddingTop: '4.5em',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >

        <Typography
          variant="h6"
          sx={{ color: 'grey.600', fontWeight: '600' }}
        >

        </Typography>

        <Typography
          variant="h5"
          sx={{ color: 'black', fontWeight: '600' }}
        >
          Update full name:
        </Typography>

        <TextField
          variant="outlined"
          label="Full Name"
          value={enteredName}
          onChange={(event) => setEnteredName(event.target.value)}
          sx={{
            marginTop: '2em', minWidth: '18em'
          }}
        />

        <Typography
          sx={{
            paddingTop: '0.5em',
          }}
        >
          {
            !nameChanged && !error ?
              (<>Current name is <b>{username}</b></>) :
              (nameChanged && !error) ?
                (<>Name successfully updated to: <b>{username}</b></>)
                : <>{error}</>
          }
        </Typography>

        <Button
          variant="contained"
          sx={{
            marginTop: '3.5em',
            padding: '0.5em 4em',
            minWidth: '18em'
          }}
          type="submit"
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default ChangeNamePage;
