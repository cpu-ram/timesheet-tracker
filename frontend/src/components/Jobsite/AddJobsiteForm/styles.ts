import { useTheme } from '@mui/material/styles';

export const useErrorTextStyle = () => {
  const theme = useTheme();
  return (
    {
      color: 'red',
    }
  )
}

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
    padding: '1.5 0 1.5 1',
    width: '100%',
    display: 'flex',
    maxWidth: '45em',
    marginBottom: '1em',
  })
}

export const useErrorWrapperStyle = () => {
  const theme = useTheme();
  return ({
    padding: '1em 0 0 0',
    margin: 0,
    paddingBottom: 1,
    paddingLeft: 1.5,
    '& p': {
      color: 'red',
    }
  })
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