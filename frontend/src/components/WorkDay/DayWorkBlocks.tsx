import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';

import { useTimesheetContext } from '../../contexts/TimesheetContext.tsx';

import { WorkBlock } from '../WorkBlock/WorkBlock.tsx';
import HoursTotal from './HoursTotal.tsx';
import WorkBlockEntryForm from '../WorkBlock/WorkBlockEntryForm/WorkBlockEntryForm.tsx';

import { WorkBlockProps, AddWorkBlockFormFlags, AddWorkBlockFormHandlers } from '../WorkBlock/types.tsx';
import { useStyleContext } from '../../contexts/StyleContext.tsx';

const DayWorkBlocks = ({ workData }) => {
  const [selectedForEditId, setSelectedForEditId] = useState(null);

  const { editMode, setEditMode, handleDeleteWorkBlock, handleEditWorkBlock } = useTimesheetContext();

  const handleEnteredData = async ({
    workBlockData, onJobsiteCreated
  }: {
    workBlockData: WorkBlockProps;
    onJobsiteCreated?: (jobsiteId: string) => void;
  }) => {
    await handleEditWorkBlock({
      workBlockId: selectedForEditId,
      workBlockData,
      onJobsiteCreated,
    });
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
    setEditMode(false);
  }

  const { theme } = useStyleContext();

  return (
    <Box
      className="day-work-blocks"
      sx={{
        padding: '0',
        marginBottom: '3em',
        borderRadius: '4px',
        border: `1.5px solid ${theme.palette.divider}`,

        '& > .work-block-element + .work-block-element': {
          borderTop: `1.5px solid ${theme.palette.divider} !important`,
        },
        '& .work-block-element:first-of-type, .work-block-entry-form:first-of-type': {
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
        },
        '& .work-block-element:last-child, .work-block-entry-form:last-of-type, .hours-total:last-of-type': {
          borderBottomLeftRadius: '4px',
          borderBottomRightRadius: '4px',
        },
      }}>
      {
        workData && (workData.length > 0) ?
          (
            <>
              {
                workData.map((workBlock) => {
                  const workBlockProps: WorkBlockProps = {
                    ...workBlock,
                    workBlockStart: workBlock.workBlockStart || null,
                    workBlockEnd: workBlock.workBlockEnd || null,
                  };


                  const editWorkBlockFormProps: AddWorkBlockFormProps = {
                    workBlockProps,
                    formFlags: { mode: 'edit' },
                    handlers: {
                      handleEnteredData,
                    },
                  };

                  return (
                    workBlock ?
                      (
                        editMode && (workBlock.workBlockId === selectedForEditId) ?
                          <WorkBlockEntryForm
                            key={workBlock.workBlockId}
                            {...editWorkBlockFormProps}
                          />
                          :
                          <WorkBlock key={workBlock.workBlockId}
                            {...{ ...workBlock, handleDeleteWorkBlock, handleSelectForEdit, editMode }} />
                      )
                      :
                      null
                  )
                })
              }
              <HoursTotal {...{ workData }}></HoursTotal>

            </>
          )
          :
          (
            <Typography key='no-records'
              sx={{
                fontStyle: 'italic',
                padding: '1em',
                textAlign: 'center',
              }}
            >
              No work records available for the selected day
            </Typography>
          )
      }
    </Box >
  );
}

export default DayWorkBlocks;