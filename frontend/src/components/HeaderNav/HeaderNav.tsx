import { useTheme, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { AppBar, Toolbar, IconButton, Box } from '@mui/material';
import NavButton from './NavButton';

import MenuIcon from '@mui/icons-material/Menu';
import PrintIcon from '@mui/icons-material/Print';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface HeaderNavProps {
  resourceNameList: string[];
  onMenuToggle: () => void;
}

const HeaderNav = ({ resourceNameList, onMenuToggle }: HeaderNavProps) => {
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
    }
  ];

  return (
    <Box>
      <AppBar
        sx={{
          position: 'fixed',
          display: 'flex',
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
          padding: 0,
          boxShadow: 'none',
          height: '3em',
          borderBottom: '1px solid black',
          boxSizing: 'content-box',
        }}>
        <Toolbar
          sx={{
            display: 'flex',
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            justifyItems: 'center',
            alignItems: 'center',
            margin: '0',
            paddingTop: '0.2em',
            backgroundColor: theme.palette.grey[100],
            zIndex: (theme) => theme.zIndex.appBar + 1000,
          }}>
          <IconButton
            sx={{
            }}
            onClick={onMenuToggle}
          >
            <MenuIcon
              sx={{
                fontSize: '1em',
                padding: 0,
                margin: 0,
              }}
            >

            </MenuIcon>
          </IconButton>

          <Box
            sx={{
              display: 'flex',
            }}
          >
            {
              resourceNameList?.map(
                (resourceName) => {
                  if (navButtonsConfig.some(item => item.name === resourceName)) {
                    const navButton = navButtonsConfig.find(item => item.name === resourceName);
                    return (
                      <NavButton
                        key={navButton.name}
                        action={() => navigate(navButton.link)}
                        icon={navButton.icon}
                      />
                    );
                  }
                  else return null;
                }) ?? <></>
            }

          </Box>

        </Toolbar>
      </AppBar >
    </Box>
  )
};

export default HeaderNav;