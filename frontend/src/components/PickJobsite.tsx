import { Grid, TextField, Typography } from '@mui/material';

const FindJobsiteForm = () => {
  return (
    <div>
      <Typography variant="h6">
        Find Jobsite:
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="Jobsite Name" />
        </Grid>
      </Grid>
    </div>
  )
}

export default FindJobsiteForm;