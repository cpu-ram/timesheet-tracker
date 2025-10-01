import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Temporal } from '@js-temporal/polyfill';


import { Box } from '@mui/material';
import { WorkBlock } from './WorkBlock.tsx';
import { WorkBlockData } from '../../types/WorkBlock.types.ts';
import WorkBlockEntryForm from './WorkBlockEntryForm/WorkBlockEntryForm.tsx';

import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Tile from '../Tile/Tile.tsx';
import ActionsTile from '../Tile/ActionsTile.tsx';

const WorkBlockPanel = ({
  workBlockId,
  workBlockData,
  titleCallback,
  date,
}: {
  workBlockId?: number;
  workBlockData?: WorkBlockData;
  titleCallback?: (title: string) => void;
  date?: Temporal.PlainDate;
}) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  useEffect(() => {
    if (!(date && titleCallback)) return;

    let title = '';
    const dateString = date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
    });

    switch (mode) {
      case 'view':
        title = dateString + ' > Viewing Work Block';
        break;
      case 'edit':
        title = dateString + ' > Editing Work Block';
        break;
      default:
        title = 'asd';
    }

    titleCallback(title);
  }, [mode, date, titleCallback]);


  const theme = useTheme();

  return (
    <Box>
      {mode === 'view' && (
        <Box>
          <Tile>
            <WorkBlock
              key={workBlockId}
              {...workBlockData}
              showActions={false}
              expandable={false}
            />

          </Tile>

          <ActionsTile>
            <Button variant="outlined" onClick={() => setMode('edit')}
              sx={{
                color: theme.palette.text.primary,
              }}
            >
              <EditIcon />
            </Button>
          </ActionsTile>
        </Box>
      )}

      {mode === 'edit' && (
        <WorkBlockEntryForm
          key={workBlockId}
          workBlockData={workBlockData}
          mode="edit"
          onDiscard={() => setMode('view')}
          onSaved={() => setMode('view')}
        />
      )}
    </Box>
  )
}

export default WorkBlockPanel;
