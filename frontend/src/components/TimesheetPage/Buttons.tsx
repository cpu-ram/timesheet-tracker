import { Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';


import { useStyleContext } from '../../contexts/StyleContext.tsx';

export default function Buttons({
  mode,
  setTimesheetPageMode,
  handleCancelEdit,
  currentDayWorkData,
  onAddButtonClick,
}: {
  mode?: 'add' | 'edit' | 'view';
  setTimesheetPageMode: (mode: 'add' | 'edit' | 'view') => void;
  handleCancelEdit: () => void;
  currentDayWorkData: any[] | null;
  onAddButtonClick: () => void;
}) {
  const { theme } = useStyleContext();

  return (
    <Grid
      container
      spacing={0}
      item
      xs={12}
      sx={{
        display: mode === 'add' ? 'none' : 'flex',

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

      {mode === 'view' ? (
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
            onClick={() => onAddButtonClick()}
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
              onClick={() => setTimesheetPageMode('edit')}
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

      {mode === 'edit' ? (
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
