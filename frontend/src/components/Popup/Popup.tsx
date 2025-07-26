import { Box, AppBar } from '@mui/material';
import { useStyleContext } from '../../contexts/StyleContext';

import CloseIcon from '@mui/icons-material/Close';

interface PopupProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Popup = ({ onClose, children }: PopupProps) => {
  const { theme } = useStyleContext();
  const handleClose = () => onClose();

  return (
    <Box
      sx={{
        zIndex: 10000,
        position: 'absolute',
        padding: '5em 0.5em',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: theme.palette.grey[100],

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          top: 0,
          left: 0,
          height: '3.15em',

          paddingTop: '0.5em',
          //paddingLeft: '1.25em',
          paddingRight: '0.5em',
          backgroundColor: 'inherit',
          boxShadow: 'none',
          alignItems: 'flex-end',

          alignSelf: 'center',
          display: 'flex',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignSelf: 'center',
            justifyContent: 'flex-end',

            width: '100%',
            maxWidth: '45em',
          }}
        >
          <CloseIcon
            sx={{
              fontSize: '1.5em',

              backgroundColor: theme.palette.grey[500],
              color: 'white',
              fontWeight: 800,

              borderRadius: '50%',
              padding: '0.32em',
              boxSizing: 'content-box',
              '&:hover, &:focus, &:active': {
                cursor: 'pointer',
                backgroundColor: theme.palette.grey[600],
              },
            }}
            onClick={handleClose}
          />
        </Box>
      </AppBar>

      <Box
        sx={{
          width: '100%',
          maxWidth: '45em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Popup;
