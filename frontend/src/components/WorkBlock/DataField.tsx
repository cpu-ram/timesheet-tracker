import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

interface DataFieldProps {
  isComplete?: boolean,
  isRequired?: boolean,
}

const DataField = styled(Typography,
  {
    shouldForwardProp: (prop) => prop !== 'isComplete' && prop !== 'isRequired',
  })
  <DataFieldProps>(
    ({
      theme, isComplete = false, isRequired = false,
    }) => {
      return {
        ...(isComplete === false && isRequired === true && {
          color: theme.palette.warning.dark,
        }),
      };
    }
  );
export default DataField;
