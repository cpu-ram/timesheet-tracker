import { Theme } from '@mui/material/styles';

export const getSubmitButtonStyle = (validationError: boolean) => (theme: Theme) => {
  return validationError
    ? {
      backgroundColor: theme.palette.warning.dark,
      color: 'white',
      '&:hover': {
        backgroundColor: theme.palette.warning.dark,
      },
    }
    : {
      backgroundColor: theme.palette.primary.dark,
      color: 'white',
    };
};

export const getDiscardButtonStyle = () => {
  return {
    backgroundColor: '#e2e3e5',
    color: '#3c4043',
    '&:hover': {
      backgroundColor: '#d6d8db',
    },
  };
};

export const getAddJobsiteFormWrapperStyle = () => {
  return {
    width: '100%',
    display: 'flex',
    maxWidth: '45em',
    marginBottom: '1em',
  };
};

export const getErrorWrapperStyle = () => {
  return {
    margin: '0.5em 0 0 0',
    '& p': {
      color: 'red',
    },
    padding: '0 0.5em',
  };
};

export const getErrorTextStyle = () => {
  return {
    color: 'red',
    borderLeft: '2px solid red',
    padding: '0.5em 0 0.5em 0.75em',
  };
};

export const getSpacerBlockStyle = () => {
  return {
    display: 'flex',
    width: '100%',
    marginTop: '1em',
  };
};

export const getEntryFieldColumnStyle = () => {
  return {
    'div + div': {
      marginTop: '0.7em',
    },
  };
};
