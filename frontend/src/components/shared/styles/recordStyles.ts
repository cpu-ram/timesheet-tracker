import { ThemeContext } from '@emotion/react';
import { useTheme } from '@mui/material/styles';

export const useFieldTitleStyle = () => {
  const theme = useTheme();
  return (
    {
      fontStyle: 'oblique 20deg',
      marginRight: '0.5em',
      color: 'theme.palette.text.secondary',
      minWidth: '7em',
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


export const useEntryFieldTextStyle = () => {
  return (
    {
      backgroundColor: 'white',
      display: 'flex',
      width: {
        xs: '100%',
      }
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
