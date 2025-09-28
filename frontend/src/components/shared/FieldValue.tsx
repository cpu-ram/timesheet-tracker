import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

interface FieldValueProps {
  isExpected?: boolean;
  children: React.ReactNode;
  additionalStyles?: SxProps<Theme>;
  compact?: boolean;
}

export function FieldValue({
  isExpected = false,
  children,
  additionalStyles = {},
  compact = false,
}: FieldValueProps) {
  const theme = useTheme();
  const undefinedWarningStatus = isExpected && children == null;

  return (
    <Typography
      component="span"
      sx={
        [
          {
            color: undefinedWarningStatus ? theme.palette.warning.dark : theme.palette.text.primary,
            paddingRight: '0.5em',
            ...(!compact && { minWidth: '10em' }),
            fontWeight: '450',
            '& span': {
              color: undefinedWarningStatus ? theme.palette.warning.dark : theme.palette.text.primary,
            },
          },
          additionalStyles,
        ] as SxProps<Theme>
      }
    >
      {
        children ??
        <span style={{
          // color: theme.palette.text.disabled 
        }}>
          —
        </span>
      }
    </Typography>
  );
}
export default FieldValue;
