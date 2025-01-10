import React, { useState } from 'react';
import { Grid, TextField, Typography, Box } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const AddWorkBlockForm = () => {
  const [formData, setFormData] = useState({
    startTime: null as Date | null,
    endTime: null as Date | null,
    jobId: '',
    supervisor: '',
    address: '',
    jobName: '',
    additionalNotes: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStartTimeChange = (newTime: Date | null) => {
    setFormData((prevData) => ({
      ...prevData,
      startTime: newTime,
    }));
  };

  const handleEndTimeChange = (newTime: Date | null) => {
    setFormData((prevData) => ({
      ...prevData,
      endTime: newTime,
    }));
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Add Work Block</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ padding: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TimePicker
                  label="Start Time"
                  value={formData.startTime}
                  onChange={handleStartTimeChange}
                  minutesStep={10}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <Grid item xs={6}>
                <TimePicker
                  label="End Time"
                  value={formData.endTime}
                  onChange={handleEndTimeChange}
                  minutesStep={10}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Job ID"
                  name="jobId"
                  value={formData.jobId}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Supervisor"
                  name="supervisor"
                  value={formData.supervisor}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Job Name"
                  name="jobName"
                  value={formData.jobName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Additional notes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Box>
        </LocalizationProvider>
      </AccordionDetails>
    </Accordion>
  );
};

export default AddWorkBlockForm;