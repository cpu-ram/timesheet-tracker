import { Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { useEffect } from 'react';

import { useStyleContext } from '../../contexts/StyleContext.tsx';

export default function Buttons({
  editMode,
  addMode,
  handleSetAddMode,
  handleSetEditMode,
  handleDiscard,
  handleCancelEdit,
  currentDayWorkData,
}: {
  editMode: boolean;
  addMode: boolean;
  handleSetAddMode: () => void;
  handleSetEditMode: () => void;
  handleDiscard: () => void;
  handleCancelEdit: () => void;
  currentDayWorkData: any[] | null;
}) {
  const { theme } = useStyleContext();

  useEffect(() => {
    handleDiscard();
  }, []);

  return (
    <Grid
      container
      spacing={0}
      item
      xs={12}
      sx={{
        display: addMode ? 'none' : 'flex',

        flexDirection: {
          xs: 'row-reverse',
          sm: 'row',
        },
        justifyContent: {
          xs: 'flex-start',
          sm: 'flex-start',
        },
        boxSizing: 'border-box',

        gap: 1,
        padding: '1em 1em 1em',

        borderBottom: `0px solid ${theme.palette.divider}`,
      }}
    >
      {editMode && addMode ? <Typography> Error</Typography> : <></>}

      {!addMode && !editMode ? (
        <Grid
          item
          sx={{
            display: 'flex',
            gap: 1,
            padding: 0,
            margin: 0,
            flexDirection: {
              xs: 'row-reverse',
              sm: 'row',
            },
          }}
        >
          <Button
            onClick={() => handleSetAddMode()}
            variant="outlined"
            sx={{
              display: 'flex',
              backgroundColor: 'white',
              color: 'black',
              boxShadow: '1px 1px 2px rgba(0,0,0,0.2)',
            }}
          >
            <AddIcon />
          </Button>

          {currentDayWorkData != null && currentDayWorkData.length > 0 && (
            <Button
              onClick={() => handleSetEditMode()}
              variant="outlined"
              sx={{
                backgroundColor: 'white',
                color: 'black',
                boxShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                padding: '0',
              }}
            >
              <EditIcon />
            </Button>
          )}
        </Grid>
      ) : (
        <></>
      )}

      {editMode ? (
        <Button
          onClick={() => handleCancelEdit()}
          sx={{
            color: 'white',
            backgroundColor: theme.palette.info.dark,
          }}
          variant="outlined"
        >
          <Typography
            variant="subtitle2"
            sx={{
              padding: '0.08em 0',
              margin: 0,
            }}
          >
            Done
          </Typography>
        </Button>
      ) : (
        <></>
      )}
    </Grid>
  );
}
