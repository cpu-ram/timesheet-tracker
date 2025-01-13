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

const UserSelectorPage: React.FC<UserSelectionPageProps> = ({ selectedUser, setSelectedUser }) => {
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
    <Container maxWidth="sm" sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <Box sx={{ textAlign: 'center', width: '100%' }}>
        <Typography variant='h5' gutterBottom>Select the user:</Typography>
        <List>
          {users.map((user) => (
            <ListItem key={user.id} sx={{ justifyContent: 'center' }}>
              <Button variant="outlined" onClick={() => handleUserSelect(user)}>{user.nickname}</Button>
            </ListItem>
          ))}
        </List>
        <Box sx={{ marginTop: 2 }}>
          <Link to="/timesheet" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">
              Go to Timesheet
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default UserSelectorPage;