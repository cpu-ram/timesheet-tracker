import { useStyleContext } from '../../../contexts/StyleContext';

export const useSpacerBlockStyle = () => {
  return ({
    display: 'flex',
    width: '100%',
    marginTop: '0em',
  })
}

export const useErrorWrapperStyle = () => {
  const { theme } = { useStyleContext };
  return ({
    margin: '0.5em 0 0.5em 0',
    '& p': {
      color: 'red',
    },
    padding: '0 0.5em',
  })
}

export const useErrorTextStyle = () => {
  const { theme } = { useStyleContext };
  return (
    {
      color: 'red',
      borderLeft: '2px solid red',
      padding: '0.5em 0 0.5em 0.75em',
    }
  )
}