import React, { useState } from 'react';
import { Grid, TextField, Typography, Box, Button } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Temporal } from '@js-temporal/polyfill';

const AddWorkBlockForm = ({ handleAddWorkBlock }) => {
  const [formData, setFormData] = useState({
    startTime: null as Temporal.PlainTime,
    endTime: null as Temporal.PlainTime,
    jobsiteId: '',
    supervisor: '',
    address: '',
    jobsiteName: '',
    additionalNotes: '',
    tempJobsiteId: '',
    tempJobsiteName: '',
    tempJobisteAddress: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = event.target.value;
    const [hour, minute] = time.split(':').map(Number);
    setFormData((prevData) => ({
      ...prevData,
      startTime: Temporal.PlainTime.from({ hour, minute: minute ?? 0 }),
    }));
  };

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = event.target.value;
    const [hour, minute] = time.split(':').map(Number);
    setFormData((prevData) => ({
      ...prevData,
      endTime: Temporal.PlainTime.from({ hour, minute: minute ?? 0 }),
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAddWorkBlock(formData);
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Add Work Block</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={2}>
              <TextField
                label="Start Time"
                type="time"
                name="startTime"
                value={formData.startTime ? formData.startTime.toString({ smallestUnit: 'minute' }) : ''}
                onChange={handleStartTimeChange}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 600, // 10 minutes
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                label="End Time"
                type="time"
                name="endTime"
                value={formData.endTime ? formData.endTime.toString({ smallestUnit: 'minute' }) : ''}
                onChange={handleEndTimeChange}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 600, // 10 minutes
                }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} style={{ padding: 0 }}>
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                label="Jobsite ID"
                name="jobsiteId"
                value={formData.jobsiteId}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                label="Supervisor"
                name="supervisor"
                value={formData.supervisor}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                label="Jobsite Name"
                name="jobsiteName"
                value={formData.jobsiteName}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Additional notes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                value="Submit"
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default AddWorkBlockForm;