import { Box } from '@mui/material';
import { ReactNode } from 'react';

const ActionsTile = ({ children}: {children: ReactNode}) => {
  return (
    <Box
      className="buttonsWrapper"
      sx={{
        display: 'flex',
        flexDirection: {
          xs: 'row-reverse',
          sm: 'row',
        },
        justifyContent: {
          xs: 'flex-start',
          sm: 'flex-start',
        },
        height: 'auto',
        padding: '0.5em 0.5em 0.5em 0.5em',
        marginTop: '0em',
        'button': {
          backgroundColor: 'white',
        },
        '& > button + button': {
          marginLeft: '0.5em',
        },
      }}
    >
      {children}
    </Box>
  );
}

export default ActionsTile;
