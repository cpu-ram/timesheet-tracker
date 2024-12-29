import { useState, useEffect } from 'react';
import { User } from '../types/userType.tsx';
import { Link } from 'react-router-dom';

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
    <div>
      <h2>Select a User</h2>
      {selectedUser && <p>Currently Selected: {selectedUser.nickname}</p>}

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <button onClick={() => handleUserSelect(user)}>{user.nickname}</button>
          </li>
        ))}
      </ul>

      <Link to="/timesheet">Continue to timesheet</Link>
    </div>
  )
}


export default UserSelectorPage;