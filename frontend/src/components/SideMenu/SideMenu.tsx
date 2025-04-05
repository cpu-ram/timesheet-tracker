import { Drawer, Box, IconButton, Typography, Button, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext.tsx';
import { logout } from '../../api/auth.ts';

import CloseIcon from '@mui/icons-material/Close';


const SideMenu = ({ isOpen, onMenuToggle }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { username, setIsAuthenticated } = useAuthContext();

  const handleLogout = async () => {
    await logout();

    setIsAuthenticated(false);
  }

  const menuItems = [
    { name: 'Calendar', link: '/timesheet' },
    { name: 'Weekly Report', link: '/reports/weekly' },
    { name: 'Jobsites', link: '/jobsites' },
  ];

  const profileLinks = []

  return (
    <Drawer
      anchor='left'
      open={isOpen}
      onClose={onMenuToggle}
      sx={{
        '& a': {
          textDecoration: 'none',
        },
        '& button, button.nav-button': {
          padding: '0 !important',
          paddingInline: '0 !important',
        },
        '& .drawer-menu-item': {
          padding: '0.3em 0 0.3em 0.5em !important',
          textTransform: 'none',
          minWidth: 0,
          margin: 0,
        },
        '& .profile-dashboard': {
          display: 'inline',
          width: '100%',
        },
        '& .profile-dashboard .drawer-menu-item': {
          paddingTop: '0 !important',
          paddingBottom: '0 !important',
          width: '100%',
          borderRadius: 0,
        },

        '& .drawer-menu-item.current': {
          backgroundColor: theme.palette.primary.main,
          color: 'white',
        },
        '& .drawer-menu-item.non-current': {
          backgroundColor: 'transparent',
          color: theme.palette.primary.main,
        },


        '& .gui-link.drawer-menu-item:hover': {
          textDecoration: 'underline',
          textUnderlineOffset: '0.3em',
        },
        '& button': {
          border: 'none',
          boxShadow: 'none',
          outline: 'none',
          justifyContent: 'flex-start',

          '&:hover': {
            backgroundColor: 'unset',
          },

          '&:focus': {
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
          },
          '&:active': {
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
          }
        }
      }}>

      <Box sx={{
        display: 'flex',
        width: '12em',
        justifyContent: 'flex-end',
        flexDirection: 'column',
        '& h1, h2, h3, h4, h5, h6': {
          fontFamily: 'Helvetica',
        }
      }}>

        <IconButton
          onClick={onMenuToggle}
          sx={{
            display: 'flex',
            alignSelf: 'flex-end',
            color: theme.palette.warning.main,
            marginBottom: '1em',
          }}>
          <CloseIcon
            sx={{
              fontSize: '1.1em',
            }}
          />
        </IconButton>
        {menuItems.map(item => (
          <Link
            key={item.name}
            href={item.link}
            className={
              `
              drawer-menu-item 
              ${location.pathname.startsWith(item.link) ? 'current' : 'non-current'}
              gui-link
              `
            }
            sx={{
            }}
          >
            <Typography variant='h6'>
              {item.name}
            </Typography>
          </Link>
        ))}
      </Box>

      <Box
        sx={{
          display: 'flex',
          marginTop: 'auto',
          marginBottom: '2em',
          padding: '0em',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          flexDirection: 'column',
        }}
      >

        <Box
          className="profile-dashboard"
        >
          <Typography
            variant="h6"
            className="drawer-menu-item"
            sx={{
              fontStyle: 'oblique',
            }}>
            {username}
          </Typography>

          <Button
            onClick={() => navigate("/profile/change-name")}
            className={
              `
              drawer-menu-item 
              ${location.pathname === "/profile/change-name" ? 'current' : 'non-current'}
              gui-link
              `
            }
          >
            <Typography variant="h6">
              —Change name
            </Typography>
          </Button>

          <br />

          <Button
            variant="text"
            disableRipple
            onClick={handleLogout}
            className="nav-button"
          >
            <Typography
              className="drawer-menu-item gui-link"
              variant="h6"
            >
              —Log out
            </Typography>
          </Button>

        </Box>

      </Box>

    </Drawer >

  );
};

export default SideMenu;