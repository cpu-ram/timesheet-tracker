import { useTheme } from '@mui/material/styles';

export const useSubmitButtonStyle = (validationError: boolean) => {
  const theme = useTheme();
  return (
    validationError ? {
      backgroundColor: theme.palette.warning.dark,
      color: 'white',
      '&:hover': {
        backgroundColor: theme.palette.warning.dark
      }
    } : {
      backgroundColor: theme.palette.primary.dark,
      color: 'white',
    })
};

export const useDiscardButtonStyle = () => {
  const theme = useTheme();
  return (
    {
      backgroundColor: "#e2e3e5",
      color: "#3c4043",
      "&:hover": {
        backgroundColor: "#d6d8db"
      },
    }
  )
}

export const useAddJobsiteFormWrapperStyle = () => {
  const theme = useTheme();
  return ({
    width: '100%',
    display: 'flex',
    maxWidth: '45em',
    marginBottom: '1em',
  })
}

export const useErrorWrapperStyle = () => {
  const theme = useTheme();
  return ({
    margin: '0.5em 0 0 0',
    '& p': {
      color: 'red',
    },
    padding: '0 0.5em',
  })
}

export const useErrorTextStyle = () => {
  const theme = useTheme();
  return (
    {
      color: 'red',
      borderLeft: '2px solid red',
      padding: '0.5em 0 0.5em 0.75em',
    }
  )
}

export const useSpacerBlockStyle = () => {
  const theme = useTheme();
  return ({
    display: 'flex',
    width: '100%',
    marginTop: '1em',
  })
}

export const useEntryFieldColumnStyle = () => {
  const theme = useTheme();
  return ({
    'div + div': {
      marginTop: '0.7em',
    }
  })
}