import { useStyleContext } from '../../contexts/StyleContext';

export const getReportPageStyle = () => {
  const { theme } = useStyleContext();
  return {
    //height: 'auto',
    //minHeight: '100%',
    width: '100%',
    display: 'flex',

    backgroundColor: theme.palette.grey[100],
    boxSizing: 'border-box',

    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',

    padding: '3.5em 0.5em 7em',
    marginBottom: '2em',
    marginTop: 0,
  };
};

export const getMainContentStyle = () => {
  const { theme } = useStyleContext();
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
    left: '0',

    margin: '0',

    padding: '0',
    borderRadius: '4px',
    backgroundColor: 'white !important',
    border: `1px solid ${theme.palette.divider}`,
    maxWidth: '45em',

    '& > .content-element:first-of-type': {
      borderRadius: '4px 4px 0 0',
    },
    '& > .content-element:last-of-type': {
      borderRadius: '0 0 4px 4px',
    },
  };
};

export const getWeekTitleContainerStyle = () => {
  return {
    display: 'flex',
    alignSelf: 'left',
    flexGrow: 0,
    padding: '0.6em 0 1.1em',
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
    margin: '0',
    height: '4em !important',
    '& h2,h3,h4,h5,h6': {
      display: 'flex',
      alignItems: 'center',
      fontFamily: 'Roboto',
      letterSpacing: '0',
      paddingLeft: '0.5em',
      height: '3em',
    },

    '& h5': {
      fontWeight: 500,
    },
  };
};

export const getWorkDayStyle = () => {
  return { marginBottom: '1em' };
};

export const getWorkDayHeaderStyle = () => {
  return {
    display: 'flex',
    justifyContent: 'space-between',
  };
};

export const getWorkDayDateStyle = () => {
  return {
    textAlign: 'left',
  };
};

export const getWorkDayHoursStyle = () => {
  return {
    fontStyle: 'italic',
    paddingLeft: '1em',
  };
};

export const getWeekTotalStyle = () => {
  return {
    display: 'flex',
    justifyContent: 'right',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0',
    border: 0,
  };
};

export const getSignBoxStyle = () => {
  const { theme } = useStyleContext();
  return {
    borderLeft: `1px solid ${theme.palette.primary.dark}`,
    padding: '0.8em 0.3em',
    maxWidth: '45em',
    alignSelf: 'center',
    mx: 'auto',
  };
};

export const getSignedStatementStyle = () => {
  return {
    fontStyle: 'oblique',
    fontWeight: 'normal',
    marginBottom: '0em',
    fontFamily: 'Georgia',
    fontSize: '1.1em',
    padding: '0.6em 0 0.7em 2em',
    color: 'black',
    width: '100%',
  };
};

export const getSignatureStyle = () => {
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    marginLeft: '0 1em',
  };
};

export const getSignButtonStyle = () => {
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    marginLeft: '2em',
  };
};

export const getDownloadsBoxStyle = () => {
  return {
    margin: 0,
    padding: '0.5em 0 1em 0',
    display: 'flex',
    fontSize: '1.2em',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    a: {
      color: 'white',
    },
  };
};

export const getCircularProgressStyle = () => {
  return {
    alignContent: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: '50%',
    marginLeft: '-0.8em',
  };
};

export const getWorkBlocksWrapperStyle = () => {
  const { theme } = useStyleContext();
  return {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0.5em',
    borderBottom: '1px solid #ccc',

    '& .work-block + .work-block': {
      borderTop: `1.5px solid ${theme.palette.divider}`,
    },
  };
};
