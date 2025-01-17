import { Typography } from '@mui/material';
import { WorkBlock } from '../WorkBlock.tsx';

const DayWorkBlocks = ({ workData, editMode, handleDeleteWorkBlock = (() => { }), handleEditWorkBlock = (() => { }) }) => {

  return (
    <>
      {
        workData ?
          (
            workData.map((workBlock) => (
              workBlock ?
                <WorkBlock {...workBlock} handleDeleteWorkBlock={handleDeleteWorkBlock} handleEditWorkBlock={handleEditWorkBlock} editMode={editMode} key={workBlock.workBlockId} />
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