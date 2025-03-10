import React, { useEffect, useState } from 'react';
import { Typography, List, ListItem, Button, Container, Box, GlobalStyles, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import '@fontsource/montserrat/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/open-sans/600.css';
import '@fontsource/roboto/400.css';

interface User {
  id: number;
  name: string,
  nickname: string;
}

interface UserSelectionPageProps {
  selectedUser: User | null;
  setSelectedUser: (user: User) => void;
}

const UserSelectorPage = ({ selectedUser, setSelectedUser }): UserSelectionPageProps => {
  const [users, setUsers] = useState<User[]>([]);

  const theme = useTheme();

  useEffect(() => {
    const fetchUsers = async () => {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      try {
        const response = await fetch(`${baseUrl}/employees`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data: User[] = await response.json();
        setUsers(data.sort((x, y) => (x.nickname + x.name) > (y.nickname + y.name) ? -1 : 1));
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <Container maxWidth="sm" spacing='0' sx={{ display: 'grid', placeItems: 'left', minHeight: '100vh', paddingTop: 5 }}>
      <GlobalStyles
        styles={{
          'body, button': {
            'fontFamily': 'Roboto !important',
          },
          'li > Button': {
            borderRadius: '0',
            boxSizing: 'border-box',
            'fontFamily': 'Montserrat, sans-serif',
          },
          'li:first-of-type > Button': {

            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          },
          'li:last-of-type > Button': {
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 4,
          },
          'button:focus': {
            borderRadius: 0,
            outline: 'none',
            borderWidth: '2px',
            borderColor: theme.palette.primary.main,
            backgroundColor: 'lightgray',
          }
        }}
      />
      <Box sx={{ textAlign: 'center', width: '100%' }}>
        <Typography variant='h5'
          sx={{
            fontWeight: 'bold',
            fontFamily: 'Inter',
            textTransform: 'capitalize'
          }}
          gutterBottom>Log in as</Typography>
        <List spacing='0'>
          {users.map((user, index) => (
            <ListItem key={user.id} sx={{
              justifyContent: 'left', width: '30', margin: 0, padding: 0
            }}>
              <Button variant="outlined"
                sx={{
                  width: '100%', justifyContent: 'left',
                  '&:hover': { backgroundColor: 'lightgray' },
                  transition: 'none',
                  borderRadius: 0,
                }}
                onClick={() => handleUserSelect(user)}>
                <Typography variant='h7'>
                  {user.nickname}
                </Typography>
              </Button>
            </ListItem>
          ))}
        </List>
        <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'left' }}>
          <Link to="/timesheet" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary" disabled={!selectedUser}>
              Go to Timesheet
            </Button>
          </Link>
        </Box>
      </Box>
    </Container >
  );
};

export default UserSelectorPage;