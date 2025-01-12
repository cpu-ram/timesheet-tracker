import { useState, useEffect } from 'react';
import { User } from '../types/userType.tsx';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { List, ListItem, Typography } from '@mui/material';

interface UserSelectionPageProps {
  selectedUser: User | null;
  setSelectedUser: (user: User) => void;
};

const UserSelectorPage = ({ selectedUser, setSelectedUser }: UserSelectionPageProps) => {
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
    }

    fetchUsers();
  }, []);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      minHeight: '100vh',
      padding: '20px',
    }}>
      <Typography variant='h6'>Select the user:</Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user.id} style={{ fontWeight: 'bold' }}>
            <Button onClick={() => handleUserSelect(user)}>{user.nickname}</Button>
          </ListItem>
        ))}
      </List>
      <Link to="/timesheet">
        <Button variant="contained" color="secondary-light">
          Continue to timesheet
        </Button>
      </Link>
    </div>
  )
}


export default UserSelectorPage;