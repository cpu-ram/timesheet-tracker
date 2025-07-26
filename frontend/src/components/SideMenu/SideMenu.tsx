import { Drawer, Box, IconButton, Typography, Button, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext.tsx';
import { logout } from '../../api/auth.ts';

import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const SideMenu = ({ isOpen, onMenuToggle }: { isOpen: boolean; onMenuToggle: () => void }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { username, setIsAuthenticated } = useAuthContext();

  const handleLogout = async () => {
    await logout();

    setIsAuthenticated(false);
  };

  const menuItems = [
    { name: 'Calendar', link: '/timesheet' },
    { name: 'Weekly Report', link: '/reports/weekly' },
    { name: 'Jobsites', link: '/jobsites' },
  ];

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={onMenuToggle}
      sx={{
        '& a': {
          textDecoration: 'none',
        },
        '& button, button.nav-button': {
          padding: '0',
          paddingInline: '0',
        },
        '& .drawer-menu-item': {
          padding: '0.3em 0 0.3em 0.5em',
          textTransform: 'none',
          minWidth: 0,
          width: '100%',
          display: 'flex',
          margin: 0,
        },
        '& .profile-dashboard': {
          display: 'inline',
        },
        '& .profile-dashboard .drawer-menu-item': {
          paddingTop: '0',
          paddingBottom: '0',
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
        '& .gui-link.drawer-menu-item.non-current:hover': {
          textDecoration: 'underline',
          backgroundColor: theme.palette.info.main,
          color: theme.palette.getContrastText(theme.palette.info.main),
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
          },
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '12em',
          justifyContent: 'flex-end',
          flexDirection: 'column',
          '& h1, h2, h3, h4, h5, h6': {
            fontFamily: 'Helvetica',
          },
        }}
      >
        <IconButton
          onClick={onMenuToggle}
          sx={{
            display: 'flex',
            alignSelf: 'flex-end',
            color: theme.palette.warning.main,
            margin: '0.25em 0.25em 0.8em',
          }}
        >
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
            className={`
              drawer-menu-item 
              ${location.pathname.startsWith(item.link) ? 'current' : 'non-current'}
              gui-link
              `}
            sx={{}}
          >
            <Typography variant="h6">{item.name}</Typography>
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
          sx={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            maxWidth: '100%',
          }}
        >
          <Typography
            variant="h6"
            className="drawer-menu-item"
            sx={{
              fontStyle: 'oblique',
              alignItems: 'center',
              gap: '0.2em',
              whiteSpace: 'wrap',
              wordBreak: 'break-word',
              maxWidth: '10em',
            }}
          >
            <AccountCircleIcon
              sx={{
                fontSize: '1.5em',
                color: theme.palette.grey[500],
              }}
            />
            {username}
          </Typography>
          <Box
            className="profile-action-links"
            sx={{
              margin: '0 0 0 1.5em',
              borderLeft: '1px solid #ccc',
              '& .profile-action-text': {
                padding: '0.1em 0 0.2em 0 !important',
              },
            }}
          >
            <Button
              onClick={() => navigate('/profile/change-name')}
              className={`
              drawer-menu-item 
              ${location.pathname === '/profile/change-name' ? 'current' : 'non-current'}
              gui-link
              `}
            >
              <Typography className="profile-action-text" variant="h6">
                —Change name
              </Typography>
            </Button>

            <Button
              className={`
              drawer-menu-item
              non-current
              gui-link
              `}
              onClick={handleLogout}
            >
              <Typography className="profile-action-text" variant="h6" sx={{}}>
                —Log out
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SideMenu;
