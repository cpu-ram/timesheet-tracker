import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';

import { WorkBlock } from '../WorkBlock/WorkBlock.tsx';
import AddWorkBlockForm from '../AddWorkBlock.tsx';

const DayWorkBlocks = ({ workData, editMode, handleDeleteWorkBlock, handleEditWorkBlock }) => {
  const [selectedForEditId, setSelectedForEditId] = useState(null);

  const handleEnteredEditData = (workBlockData) => {
    handleEditWorkBlock({ workBlockId: selectedForEditId, workBlockData });
  }

  useEffect(() => {
    setSelectedForEditId(null);
  }, [workData]);
  useEffect(() => {
    if (!editMode) {
      setSelectedForEditId(null);
    }
  }, [editMode])

  const handleSelectForEdit = (workBlockId) => {
    setSelectedForEditId(workBlockId);
  }
  const handleDiscardEdit = () => {
    setSelectedForEditId(null);
  }

  return (
    <Box sx={{
      paddingTop: 1.2,
      maxWidth: '45em',
    }}>
      {
        workData ?
          (
            workData.map((workBlock) => (
              workBlock ?
                (
                  editMode && (workBlock.workBlockId === selectedForEditId) ?
                    <AddWorkBlockForm {...{
                      ...workBlock,
                      workBlockStart: workBlock.workBlockStart ? workBlock.workBlockStart : null,
                      workBlockEnd: workBlock.workBlockEnd ? workBlock.workBlockEnd : null,
                      handleEnteredData: handleEnteredEditData,
                      handleDiscard: handleDiscardEdit,
                      mode: editMode ? 'edit' : 'add'
                    }} key={workBlock.workBlockId} />
                    :
                    <WorkBlock {...{ ...workBlock, handleDeleteWorkBlock, handleSelectForEdit, editMode }} key={workBlock.workBlockId} />
                )
                :
                null
            ))
          )
          :
          (
            <Typography key='no-records' sx={{ fontStyle: 'italic' }}>
              No work records available for the selected day
            </Typography>
          )
      }
    </Box>
  );
}

export default DayWorkBlocks;