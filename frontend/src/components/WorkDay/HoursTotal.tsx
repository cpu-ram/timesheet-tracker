import { Typography, Box } from '@mui/material';
import { useStyleContext } from '../../contexts/StyleContext.tsx';
import { WorkBlockProps } from '../../types/WorkBlock.types.ts';

const HoursTotal = ({ workData }:{workData: WorkBlockProps[]}) => {
  const { theme } = useStyleContext();

  return (

    workData && workData.length > 0 ?
      (
        <Box 
          className="hours-total"
          sx={{
            width: 'auto',
            display: 'flex',
            alignItems: 'center',
            borderTop: `1.5px solid ${theme.palette.divider}`,
            padding: '0.5em 1.25em 0.7em',
            backgroundColor: 'white',
          }}

        >
          <Typography
            variant='subtitle1'
            align='center'
            sx={{
              display: 'inline-flex',
              margin: 0,

              fontWeight: 700,
              textUnderlineOffset: '0.2em',
              whiteSpace: 'pre'

            }}>

            {`T:  `}
            <u>

              {workData ?
                (Math.round(workData
                  .reduce((acc: number, workBlock: WorkBlockProps) => (
                    workBlock.workBlockStart && workBlock.workBlockEnd ?
                      acc + (workBlock.workBlockStart).until(workBlock.workBlockEnd).total({ unit: 'hours' })
                      :
                      acc
                  ), 0)) * 10) / 10 : 0}
              {"h"}
            </u>
          </Typography>
        </Box>
      )
      :
      <></>

  )
}

export default HoursTotal;
