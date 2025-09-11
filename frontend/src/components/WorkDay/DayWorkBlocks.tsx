import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

import { useTimesheetContext } from '../../contexts/TimesheetContext.tsx';

import { WorkBlock } from '../WorkBlock/WorkBlock.tsx';
import HoursTotal from './HoursTotal.tsx';
import WorkBlockEntryForm from '../WorkBlock/WorkBlockEntryForm/WorkBlockEntryForm.tsx';

import { WorkBlockData, WorkBlockEntryFormProps } from '../../types/WorkBlock.types.ts';
import { useStyleContext } from '../../contexts/StyleContext.tsx';

const DayWorkBlocks = ({ workData }: { workData: WorkBlockData[] }) => {
  const [selectedForEditId, setSelectedForEditId] = useState<number | null>(null);

  const { timesheetPageMode, handleDeleteWorkBlock, handleEditWorkBlock } = useTimesheetContext();

  const handleEnteredData = async ({
    workBlockData,
    onJobsiteCreated,
  }: {
    workBlockData: WorkBlockData;
    onJobsiteCreated?: (jobsiteId: string) => void;
  }) => {
    await handleEditWorkBlock({
      workBlockId: selectedForEditId,
      workBlockData,
      onJobsiteCreated,
    });
  };

  useEffect(() => {
    setSelectedForEditId(null);
  }, [workData]);
  useEffect(() => {
    if (timesheetPageMode !== 'edit') {
      setSelectedForEditId(null);
    }
  }, [timesheetPageMode]);

  const handleSelectForEdit = (workBlockId: number) => {
    setSelectedForEditId(workBlockId);
  };

  const { theme } = useStyleContext();

  return (
    <Box>
      <Box
        className="day-work-blocks"
        sx={{
          padding: '0',
          marginBottom: '0',
          backgroundColor: 'white',
          borderRadius: '4px',
          border: `1.5px solid ${theme.palette.divider}`,

          '& > .work-block-element + .work-block-element': {
            borderTop: `1.5px solid ${theme.palette.divider} !important`,
          },
          '& .work-block-element:first-of-type, .work-block-entry-form:first-of-type': {
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
          },
          '& .work-block-element:last-child, .work-block-entry-form:last-of-type, .hours-total:last-of-type':
          {
            borderBottomLeftRadius: '4px',
            borderBottomRightRadius: '4px',
          },
        }}
      >
        {workData && workData.length > 0 ? (
          <>
            {workData.map((workBlock: WorkBlockData) => {
              if (!workBlock.workBlockId) throw new Error('Error: Work Block id missing');

              const workBlockData: WorkBlockData = workBlock;

              const editWorkBlockFormProps: WorkBlockEntryFormProps = {
                workBlockData,
                mode: 'edit',
                onEnteredData: handleEnteredData,
              };

              return workBlock ? (
                timesheetPageMode === 'edit' && workBlock.workBlockId === selectedForEditId ? (
                  <WorkBlockEntryForm
                    key={workBlock.workBlockId}
                    workBlockData={workBlockData}
                    mode="edit"
                    onEnteredData={handleEnteredData}
                  />
                ) : (
                  <WorkBlock
                    key={workBlock.workBlockId}
                    {...{
                      ...workBlock,
                      handleDeleteWorkBlock, handleSelectForEdit,
                      showActions: timesheetPageMode === 'edit'
                    }}
                  />
                )
              ) : null;
            })}
          </>
        ) : (
          <Typography
            key="no-records"
            sx={{
              fontStyle: 'italic',
              padding: '1em',
              textAlign: 'center',
            }}
          >
            No work records available for the selected day
          </Typography>
        )}
      </Box>
      <HoursTotal {...{ workData }}></HoursTotal>
    </Box>
  );
};

export default DayWorkBlocks;
