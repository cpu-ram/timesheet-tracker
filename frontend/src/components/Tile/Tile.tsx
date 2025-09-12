import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Tile = ({ children }) => {
  const theme = useTheme();
  return (
    <Box sx={{
      backgroundColor: 'white',
      borderRadius: '4px',
      border: `1.5px solid ${theme.palette.divider}`,
      padding: '0.7em 0.5em 1em 0.5em',
    }}>
      {children}
    </Box>
  )
}

export default Tile;