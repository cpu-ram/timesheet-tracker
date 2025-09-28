import { Typography, Box, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';

import SearchIcon from '@mui/icons-material/Search';

import { useState } from 'react';

import { SearchMatchMarkedText } from './SearchMatchMarkedText';

import { useStyleContext } from '../../../contexts/StyleContext.tsx';
import { useTimesheetContext } from '../../../contexts/TimesheetContext.tsx';

interface JobsiteOption {
  id: string;
  [key: string]: any;
}

export default function JobsiteSearch({
  foundDataCallback,
}: {
  foundDataCallback?: (arg: { jobsiteId: string }) => void;
}) {
  const { theme } = useStyleContext();
  const { jobsiteSearchResults, handleSearchJobsites } = useTimesheetContext();

  const [jobsiteSearchQuery, setJobsiteSearchQuery] = useState('');

  return (
    <Grid
      id="jobsite-search-container"
      item xs={12}
    >
      <Box
        sx={{
          flexDirection: 'row',
          alignSelf: 'top',
          flex: 1,
          margin: 0,

          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '0',
          gap: 1,

          '& #jobsite-search-autocomplete': {
            paddingLeft: '3em',
          },

          '& .MuiInputLabel-root[data-shrink="false"]': {
            transform: 'none !important',
            height: '100% !important',
            display: 'flex',
            alignItems: 'center',
            padding: '0 0 0 3em',
          },

          '& .MuiInputLabel-root[data-shrink="true"]': {
            padding: 0,
            marginLeft: '2.55em',
          },

          '& fieldset > legend': {
            marginLeft: '3.2em',
          },
        }}
      >
        <Autocomplete<JobsiteOption>
          value={null}
          id="jobsite-search-autocomplete"
          sx={{
            zIndex: 1000,
            padding: '0 0',
            marginBottom: '1em',

            flexGrow: 1,
            '& .MuiAutocomplete-paper': {
              boxShadow: '0px 4px 10px rgba(0,0,0,0.15)',
              '& .MuiPaper-root::first-of-type': {
                borderTopLeftRadius: '0.3em',
                borderTopRightRadius: '0.3em',
              },
            },
          }}
          slotProps={{
            paper: {
              elevation: 20,
              sx: {
                borderRadius: '4px',
                marginTop: '0.5em',
                boxShadow: '0px 30px 100px rgba(0,0,0,0.35)',
              },
            },
            listbox: {
              sx: theme => ({
                '& .MuiAutocomplete-option': {
                  '&.Mui-focused, &.Mui-selected': {
                    bgcolor: theme.palette.action.hover,
                  },
                },
              }),
            },
          }}
          inputValue={jobsiteSearchQuery}
          filterOptions={options => options}
          options={jobsiteSearchResults}
          getOptionLabel={option => option.id}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderOption={(props, option) => {
            const { key, ...restProps } = props;
            return (
              <li className="autocomplete-option-line" key={key} {...restProps}>
                <Box component="span" sx={{
                  zIndex: 10000,
                }}>
                  {Object.entries(option)
                    .filter(([, value]) => value != null)
                    .map(([key, value]) => {
                      return (
                        <Typography
                          key={key}
                          component="span"
                          sx={{
                            fontSize: '14px',
                            mr: 1,
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              fontSize: '13px',
                            }}
                          >
                            {`${key}: `}
                          </Box>

                          <SearchMatchMarkedText
                            text={value.toString()}
                            query={jobsiteSearchQuery}
                          />
                        </Typography>
                      );
                    })}
                </Box>
              </li>
            );
          }}
          onInputChange={(_event, newValue) => {
            setJobsiteSearchQuery(newValue);
            handleSearchJobsites(newValue);
          }}
          onChange={(_, value) => {
            if (value?.id && foundDataCallback) {
              const jobsiteId: string = value.id;
              foundDataCallback({ jobsiteId });
            }
          }}
          renderInput={params => (
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
              }}
            >
              <TextField
                sx={{
                  fontStyle: 'italic',
                  backgroundColor: theme.palette.grey[100],
                  boxShadow: '0px 5px 5px rgba(0,0,0,0.15)',

                  borderTopLeftRadius: '1.5em 50%',
                  borderTopRightRadius: '1.5em 50%',
                  borderBottomLeftRadius: '1.5em 50%',
                  borderBottomRightRadius: '1.5em 50%',

                  padding: 0,

                  '& input': {
                    borderTopLeftRadius: '1.5em 50%',
                    borderTopRightRadius: '1.5em 50%',
                    borderBottomLeftRadius: '1.5em 50%',
                    borderBottomRightRadius: '1.5em 50%',
                  },

                  '& .MuiOutlinedInput-root': {
                    borderTopLeftRadius: '1.5em 50%',
                    borderTopRightRadius: '1.5em 50%',
                    borderBottomLeftRadius: '1.5em 50%',
                    borderBottomRightRadius: '1.5em 50%',

                    height: '2.75em',
                    padding: 0,
                  },
                  '& .MuiInputLabel-root': {
                    padding: 0,
                    paddingLeft: '2.3em',
                    paddingBottom: '2em',
                  },

                  boxSizing: 'border-box',
                }}
                {...params}
                label="Search Jobsites"
                fullWidth
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 'calc(50% - 10px)',
                  left: '1em',
                  zIndex: 10,
                }}
              >
                <SearchIcon
                  sx={{
                    color: theme.palette.grey[700],
                    fontSize: {
                      sx: '40px',
                    },
                  }}
                />
              </Box>
            </Box>
          )}
        />
      </Box>
    </Grid>
  );
}
