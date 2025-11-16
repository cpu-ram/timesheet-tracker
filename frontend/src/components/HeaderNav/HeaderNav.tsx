import { useTheme, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { AppBar, Toolbar, IconButton, Box, Typography } from '@mui/material';
import NavButton from './NavButton';

import MenuIcon from '@mui/icons-material/Menu';
import PrintIcon from '@mui/icons-material/Print';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface HeaderNavProps {
  title?: string;
  resourceNameList: string[];
  onMenuToggle: () => void;
}

const HeaderNav = ({
  title,
  resourceNameList,
  onMenuToggle,
}: HeaderNavProps) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const navButtonsConfig = [
    {
      name: 'timesheet',
      link: '/timesheet',
      icon: CalendarMonthIcon,
    },
    {
      name: 'weekly_report',
      link: '/reports/weekly',
      icon: PrintIcon,
    },
  ];

  return (
    <Box
      sx={{
        display: 'block',
        width: '100vw',
        maxWidth: '100vw',

        boxSizing: 'border-box',
        padding: 0,
        zIndex: 1200,
      }}
    >
      <AppBar
        className="appbar"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,

          width: '100%',
          maxWidth: '100vw',
          boxSizing: 'border-box',

          boxShadow: 'none',

          backgroundColor: alpha(theme.palette.grey[100], 0.98),

          alignItems: 'center',
        }}
      >
        <Toolbar
          sx={{
            width: '100%',
            maxWidth: '45em',

            height: {
              xs: '48px',
            },
            minHeight: {
              xs: '48px',
            },

            maxHeight: '2.8rem',

            boxSizing: 'border-box',
            px: 1,
            display: 'flex',
            //justifyContent: 'flex-start',
            alignItems: 'center',

            backgroundColor: 'transparent',
            borderBottom: '1px solid #ccc',
          }}
        >
          <IconButton sx={{
            alignSelf: 'left',
          }} onClick={onMenuToggle}>
            <MenuIcon
              sx={{
                fontSize: '1em',
                padding: 0,
                margin: 0,
                color: `${theme.palette.info.dark} !important`,
                fontWeight: 500,
              }}
            ></MenuIcon>
          </IconButton>

          {title && (
            <Typography variant="h6"
              sx={{
                fontWeight: 500,
                fontSize: '1em',
                color: 'black',

                alignSelf: 'left',
                ml: '0.5em',
              }}>
              {title}
            </Typography>
          )}

          <Box sx={{
            ml: 'auto',
          }}>
            {resourceNameList?.map(resourceName => {
              if (navButtonsConfig.some(item => item.name === resourceName)) {
                const navButton = navButtonsConfig.find(item => item.name === resourceName);
                if (!navButton) console.error('Requested resource navigation button is missing');
                return (
                  navButton && (
                    <NavButton
                      key={navButton.name}
                      action={() => navigate(navButton.link)}
                      icon={navButton.icon}
                    />
                  )
                );
              } else return null;
            }) ?? <></>}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default HeaderNav;
