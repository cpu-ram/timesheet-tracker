import { ThemeContext } from '@emotion/react';
import { useTheme } from '@mui/material/styles';

export const useFieldTitleStyle = () => {
  return (
    {
      fontStyle: 'oblique 20deg',
      marginRight: '0.5em',
      minWidth: '20em',
      color: '#555555',
    }
  );
}

export const useFieldWithMissingDataStyle = () => {
  const theme = useTheme();
  return (
    {
      color: theme.palette.warning.dark,
    }
  )
}

export const useSpacerBlockStyle = () => {
  return ({
    display: 'flex',
    width: '100%',
    marginTop: '1em',
  })
}

export const useHorizontalSeparatorStyle = () => {
  return ({
    borderRight: '1px solid #ccc',
    height: '100%',
    width: '1px',
    margin: '0',
  })
}
