import { useTheme } from '@mui/material/styles';

export const getFieldTitleStyle = () => {
  return {
    fontStyle: 'oblique 20deg',
    marginRight: '0.5em',
    color: 'theme.palette.text.secondary',
    minWidth: '7em',
  };
};

export const getFieldWithMissingDataStyle = () => {
  const theme = useTheme();
  return {
    color: theme.palette.warning.dark,
  };
};

export const getEntryFieldTextStyle = () => {
  return {
    backgroundColor: 'white',
    display: 'flex',
    width: {
      xs: '100%',
    },
  };
};

export const getSpacerBlockStyle = () => {
  return {
    display: 'flex',
    width: '100%',
    marginTop: '1em',
  };
};

export const getHorizontalSeparatorStyle = () => {
  return {
    borderRight: '1px solid #ccc',
    height: '100%',
    width: '1px',
    margin: '0',
  };
};
