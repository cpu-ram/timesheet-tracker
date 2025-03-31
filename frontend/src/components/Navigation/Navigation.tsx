import { useState } from 'react';
import { Box } from '@mui/material';
import SideMenu from '../SideMenu/SideMenu.tsx';
import HeaderNav from '../HeaderNav/HeaderNav.tsx';

const Navigation = ({ resourceNameList }) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const toggleMenu = () => setMenuIsOpen(!menuIsOpen);

  return (

    <Box
      sx={{
        position: 'fixed',
        width: '100%',
        zIndex: 999,
      }}
    >
      <HeaderNav {...{ resourceNameList }} onMenuToggle={toggleMenu} />
      <SideMenu isOpen={menuIsOpen} onMenuToggle={toggleMenu} />
    </Box>

  );
};

export default Navigation;