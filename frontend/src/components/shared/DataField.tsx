import { styled, useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';


interface DataFieldProps {
  isExpected?: boolean;
  children: React.ReactNode;
  additionalStyles?: SxProps<Theme>;
}

export function DataField({
  isExpected = false,
  children,
  additionalStyles = {},
}: DataFieldProps) {
  const theme = useTheme();
  const undefinedWarningStatus = (isExpected && (children == null));
  return (
    <Typography
      component='span'
      sx={
        [
          {
            color: undefinedWarningStatus ? theme.palette.warning.dark : undefined,
            paddingRight: '0.5em',
          }
          ,
          additionalStyles,
        ]
      }
    >
      {children ?? '[—]'}
    </Typography>
  );
}
export default DataField;
