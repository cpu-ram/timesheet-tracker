import React, { useState } from 'react';
import { Grid, TextField, Typography, Box, Button } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddIcon from '@mui/icons-material/Add';
import ExpandIcon from '@mui/icons-material/ExpandMore';
import { Temporal } from '@js-temporal/polyfill';


const AddWorkBlockContainer = ({ handleAddWorkBlock, children }) => {
  const [toggleIsExpanded, setToggleIsExpanded] = useState(false);
  const handleToggleSwitch = () => {
    setToggleIsExpanded(!toggleIsExpanded)
  }

  return (
    <Accordion expanded={toggleIsExpanded} onChange={handleToggleSwitch}>
      <AccordionSummary
        expandIcon={toggleIsExpanded ? (<ExpandIcon />) : (<AddIcon />)}
        sx={{ flexDirection: 'row-reverse' }}
      >
        <Typography
          variant='h6'
          sx={{ paddingLeft: 1 }}
        >
          Add work block
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {children}
      </AccordionDetails>
    </Accordion>
  )
}

export default AddWorkBlockContainer;