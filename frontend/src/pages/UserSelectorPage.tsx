import React, { useEffect, useState } from 'react';
import { Typography, List, ListItem, Button, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';

interface User {
  id: string;
  nickname: string;
}

interface UserSelectionPageProps {
  selectedUser: User | null;
  setSelectedUser: (user: User) => void;
}

const UserSelectorPage = ({ selectedUser, setSelectedUser }): UserSelectionPageProps => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      try {
        const response = await fetch(`${baseUrl}/employees`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data: User[] = await response.json();
        setUsers(data);
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
      <Box sx={{ textAlign: 'center', width: '100%' }}>
        <Typography variant='h5'
          sx={{
            fontWeight: 'bold',
          }}
          gutterBottom>Select the user:</Typography>
        <List spacing='0'>
          {users.map((user, index) => (
            <ListItem key={user.id} sx={{
              justifyContent: 'left', width: '30', margin: 0, padding: 0
            }}>
              <Button variant="outlined"
                sx={{
                  width: '100%', justifyContent: 'left',
                  '&:hover': { backgroundColor: 'lightgray' },
                  borderTopLeftRadius: index === 0 ? 4 : 0,
                  borderTopRightRadius: index === 0 ? 4 : 0,
                  borderBottomLeftRadius: index === users.length - 1 ? 4 : 0,
                  borderBottomRightRadius: index === users.length - 1 ? 4 : 0,
                  transition: 'none',
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