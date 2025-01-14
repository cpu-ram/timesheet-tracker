import { Grid, Typography } from '@mui/material';

const HoursTotal = ({ workData }) => {
  return (
    <>
      {
        workData ?
          (<Grid container>
            <Grid item xs={12} sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }} />

            <Grid item xs={1.5}>
              <Typography align='right'>
                <b>Total:</b>
              </Typography>
            </Grid>

            <Grid item xs={3}>
              <Typography align='left'>
                <b style={{ whiteSpace: 'pre' }}>
                  {'    '}
                  {workData ? workData.reduce((acc, workBlock) => (
                    workBlock.workBlockStart && workBlock.workBlockEnd ?
                      acc + (new Date(workBlock.workBlockEnd).getTime() - new Date(workBlock.workBlockStart).getTime()) / 1000 / 60 / 60
                      :
                      acc
                  ), 0) : 0}
                  {"h"}
                </b>
              </Typography>
            </Grid>
          </Grid>
          )
          :
          (null)
      }
    </>
  )
}

export default HoursTotal;