import { Typography, Box } from '@mui/material';
import { useStyleContext } from '../../contexts/StyleContext.tsx';
import { WorkBlockProps } from '../../types/WorkBlock.types.ts';

const HoursTotal = ({ workData }: { workData: WorkBlockProps[] }) => {
  const { theme } = useStyleContext();

  return workData && workData.length > 0 ? (
    <Box
      className="hours-total"
      sx={{
        width: 'auto',
        display: 'flex',
        borderTop: `0px solid ${theme.palette.divider}`,
        padding: '1.5em 1.25em 0.7em',
        backgroundColor: 'transparent',

        paddingLeft: `${(83 / 120) * 100}%`,
      }}
    >
      <Typography
        variant="subtitle1"
        align="right"
        sx={{
          display: 'inline-flex',
          margin: 0,
          padding: '0 0.6em',

          fontWeight: 700,
          textUnderlineOffset: '0.2em',
          whiteSpace: 'pre',

          marginLeft: '-1.1em',

          borderBottom: `1.5px solid ${theme.palette.grey[500]}`,
        }}
      >
        {`T:  `}

        {workData
          ? (Math.round(
              workData.reduce(
                (acc: number, workBlock: WorkBlockProps) =>
                  workBlock.workBlockStart && workBlock.workBlockEnd
                    ? acc +
                      workBlock.workBlockStart
                        .until(workBlock.workBlockEnd)
                        .total({ unit: 'hours' })
                    : acc,
                0,
              ),
            ) *
              10) /
            10
          : 0}
        {'h'}
      </Typography>
    </Box>
  ) : (
    <></>
  );
};

export default HoursTotal;
