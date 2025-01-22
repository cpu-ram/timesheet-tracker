import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { WorkBlock } from '../WorkBlock.tsx';
import AddWorkBlockForm from '../AddWorkBlock.tsx';

const DayWorkBlocks = ({ workData, editMode, handleDeleteWorkBlock, handleEditWorkBlock }) => {
  const [selectedForEditId, setSelectedForEditId] = useState(null);

  const handleEnteredEditData = (workBlockData) => {
    handleEditWorkBlock({ workBlockId: selectedForEditId, workBlockData });
  }

  useEffect(() => {
    setSelectedForEditId(null);
  }, [workData]);

  const handleSelectForEdit = (workBlockId) => {
    setSelectedForEditId(workBlockId);
  }
  const handleDiscardEdit = () => {
    setSelectedForEditId(null);
  }

  return (
    <>
      {
        workData ?
          (
            workData.map((workBlock) => (
              workBlock ?
                (
                  editMode && (workBlock.workBlockId === selectedForEditId) ?
                    <AddWorkBlockForm {...workBlock} handleEnteredData={handleEnteredEditData} handleDiscard={handleDiscardEdit} key={workBlock.workBlockId} />
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
    </>
  );
}

export default DayWorkBlocks;