import { Box, AppBar } from '@mui/material';
import { useStyleContext } from '../../contexts/StyleContext';
import { alpha } from '@mui/material/styles';
import { Typography } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

interface PopupProps {
  onClose: () => void;
  title: string;
  parentPopupTitle?: string | null;
  children: React.ReactNode;
}

const Popup = ({ onClose, title, parentPopupTitle, children }: PopupProps) => {
  const { theme } = useStyleContext();
  const handleClose = () => onClose();

  console.log('parentPopupTitle:', parentPopupTitle);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        boxSizing: 'border-box',
        display: 'block',
        width: '100%',
        height: '100%',

        backgroundColor: theme.palette.grey[300],
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          color: theme.palette.text.primary,
          width: '90%',
          margin: '0 auto',
          padding: '0.3em 1.2em',
          borderRadius: '10px 10px 0 0',
          backgroundColor: theme.palette.grey[100],
          fontWeight: 500,
          opacity: 0.5,

          border: `1px solid ${theme.palette.divider}`,

          display: parentPopupTitle ? 'block' : 'none',
        }}>
        {parentPopupTitle}
      </Typography>

      <Box
        sx={{
          zIndex: 20,
          position: 'fixed',

          boxSizing: 'border-box',


          padding: '3.8em 0.5em 0 0.5em',

          ...(parentPopupTitle && {
            top: '1.65em',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '10px 10px 0 0',
            backgroundColor: 'blue !important',
          }),

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
          position="absolute"
          sx={{
            top: 0,
            left: 0,
            height: '3.15em',
            maxWidth: '45em',
            margin: '0 auto',

            borderRadius: 'inherit',

            padding: '0.5em 0.5em 0 0.7em',
            backgroundColor: (theme) => alpha(theme.palette.grey[100], 0.82),

            boxShadow: 'none',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',

            alignSelf: 'center',
            display: 'flex',

            color: theme.palette.text.primary,
          }}
        >
          <Typography
            variant="h6"
          >
            {title}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              height: 'auto',
              alignSelf: 'flex-end',

              width: 'auto',
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
    </Box>
  );
};

export default Popup;
