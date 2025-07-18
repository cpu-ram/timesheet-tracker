import React from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';


interface NavButtonProps {
  action: () => void;
  key: string;
  icon: React.ElementType;
}

const NavButton = (({ action, icon: Icon }: NavButtonProps) => {
  const theme = useTheme();

  return (
    <IconButton
      sx={{
        boxSizing: 'border-box',
        width: 'auto',
        alignSelf: 'center',
        margin: '0',
        padding: '0.32em',
        background: 'transparent',
        '&:hover': {
          background: alpha(theme.palette.grey[400], 0.3),
        },
        color: theme.palette.info.dark,
      }}
      onClick={action}
    >
      <Icon
        sx={{
          border: 0,
          fontSize: '1em',
          padding: 0,
          margin: 0,
        }}
      />
    </IconButton >
  )
});

export default NavButton;