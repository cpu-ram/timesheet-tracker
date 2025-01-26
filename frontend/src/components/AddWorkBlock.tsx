import { useEffect } from 'react';
import React, { useState } from 'react';
import { Grid, TextField, Box, Button } from '@mui/material';
import { Temporal } from '@js-temporal/polyfill';

const AddWorkBlockForm = ({
  workBlockStart = null, workBlockEnd = null, jobsiteId = null, supervisorName = null, jobsiteAddress = null,
  jobsiteName = null, additionalNotes = null, handleEnteredData, handleDiscard
}) => {
  const initializeFormData = () => ({
    workBlockStart: workBlockStart ? workBlockStart : '',
    workBlockEnd: workBlockEnd ? workBlockEnd : '',
    jobsiteId: jobsiteId ?? null,
    supervisorName: supervisorName ?? null,
    jobsiteAddress: jobsiteAddress ?? null,
    jobsiteName: jobsiteName ?? null,
    additionalNotes: additionalNotes ?? null
  });

  const [formData, setFormData] = useState(initializeFormData());

  useEffect(() => {
    setFormData(
      initializeFormData()
    );
  }, [workBlockStart, workBlockEnd, jobsiteId, supervisorName, jobsiteAddress, jobsiteName, additionalNotes]);


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
      workBlockStart: Temporal.PlainTime.from({ hour, minute: minute ?? 0 }),
    }));
  };

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = event.target.value;
    const [hour, minute] = time.split(':').map(Number);
    setFormData((prevData) => ({
      ...prevData,
      workBlockEnd: Temporal.PlainTime.from({ hour, minute: minute ?? 0 }),
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleEnteredData(formData);
    handleDiscard();
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={2}>
          <TextField
            label="Start Time"
            type="time"
            name="startTime"
            value={formData.workBlockStart ? formData.workBlockStart.toString({ smallestUnit: 'minute' }) : ''}
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
            value={formData.workBlockEnd ? formData.workBlockEnd.toString({ smallestUnit: 'minute' }) : ''}
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
            value={formData.jobsiteId ?? ''}
            onChange={handleInputChange}
            fullWidth
            inputProps={{
              autoComplete: 'off'
            }}
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            label="Supervisor"
            name="supervisorName"
            value={formData.supervisorName ?? ''}
            onChange={handleInputChange}
            fullWidth
            inputProps={{
              autoComplete: 'off'
            }}
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            label="Address"
            name="jobsiteAddress"
            value={formData.jobsiteAddress ?? ''}
            onChange={handleInputChange}
            fullWidth
            inputProps={{
              autoComplete: 'off'
            }}
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            label="Jobsite Name"
            name="jobsiteName"
            value={formData.jobsiteName ?? ''}
            onChange={handleInputChange}
            fullWidth
            inputProps={{
              autoComplete: 'off'
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Additional notes"
            name="additionalNotes"
            value={formData.additionalNotes ?? ''}
            onChange={handleInputChange}
            fullWidth
            inputProps={{
              autoComplete: 'off'
            }}
          />
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            onClick={handleSubmit}
            value="Save"
          >
            Save
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant='contained'
            onClick={handleDiscard}
            value="Discard"
            sx={{
              backgroundColor: "#e2e3e5",
              color: "black",
              "&:hover": {
                backgroundColor: "#d6d8db"
              }
            }}
          >
            Discard
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddWorkBlockForm;