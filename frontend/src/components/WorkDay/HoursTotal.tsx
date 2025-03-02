import { Grid, Typography } from '@mui/material';

const HoursTotal = ({ workData }) => {
  return (
    <>
      {
        workData ?
          (
            <Grid item xs={1.5}
              sx={{
                width: 'auto',
                display: 'flex',
                alignItems: 'center',
                borderTop: '1px solid black',
                paddingTop: '0.5em',
                marginTop: '1em',
              }}

            >
              <Typography align='center'
                sx={{
                  display: 'inline-flex',
                  whiteSpace: 'nowrap',
                  margin: 0,
                }}>
                <b>Day total:</b>
              </Typography>

              <Typography
                align='left'
              >
                <b style={{ whiteSpace: 'pre' }}>
                  {'    '}
                  {workData ? workData.reduce((acc, workBlock) => (
                    workBlock.workBlockStart && workBlock.workBlockEnd ?
                      acc + Math.round(workBlock.workBlockStart.until(workBlock.workBlockEnd).total({ unit: 'hours' }) * 10) / 10
                      :
                      acc
                  ), 0) : 0}
                  {"h"}
                </b>
              </Typography>
            </Grid>
          )
          :
          (null)
      }
    </>
  )
}

export default HoursTotal;