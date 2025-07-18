import { Box, Typography } from '@mui/material';
import { Temporal } from '@js-temporal/polyfill';
import { WorkBlockData } from '../../../types/WorkBlock.types.js';

import { useStyleContext } from '../../../contexts/StyleContext.tsx';

import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const dictionary = [
  {
    key: 'workBlockStart',
    label: 'From:',
  },
  {
    key: 'workBlockEnd',
    label: 'To:',
  }
];

const formatForDisplay = (value: Temporal.PlainTime | string) => {
  if (value instanceof Temporal.PlainTime) {
    return value.toLocaleString(
      'en-US',
      {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }
    )
  } else if (typeof value === 'string') {
    return value;
  }
}

export function SuggestedData(
  {
    fields,
    suggestedWorkBlockProps,
    handleMerge
  }: {
    fields: string[],
    suggestedWorkBlockProps: WorkBlockData,
    handleMerge: ({
      fields,
      suggestedData
    }: {
      fields: Array<keyof WorkBlockData>;
      suggestedData: WorkBlockData;
    }) => void
  }) {

  const { theme } = useStyleContext();

  return (
    <Box
      key="suggested-data"
      sx={{
        marginTop: '1.6em',
        '& p + p': {
          marginTop: '0.25em',
        },
        '&p': {
          padding: '0',
        },
        padding: '0.5em',
        paddingBottom: '1em',
        border: '2px dashed #ccc',

        borderRadius: '0.3em',

        backgroundColor: '#f9f9f9',
      }}
    >
      <Box
        key="button-wrapper"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          height: 'auto',
          boxSizing: 'border-box',

          alignItems: 'center',
        }}
      >
        <IconButton
          key="arrow-wrapper"
          disableFocusRipple
          sx={{
            display: 'inline-flex',

            boxShadow: '0',
            '&.Mui-focusVisible': {
              outline: 'none',
              boxShadow: 'none',
              backgroundColor: 'white !important',
            },
            '&:focus, &:focus-visible, &.Mui-focusVisible': {
              outline: 'none !important',
              boxShadow: 'none !important',
              backgroundColor: 'white !important',
            },
            borderRadius: '50%',
            alignSelf: 'center',
            backgroundColor: 'white !important',
            border: `1px solid ${theme.palette.primary.main}`,
            padding: '0.3em',

            boxSizing: 'border-box',

            justifyContent: 'center',
            alignItems: 'center',

            marginTop: '-1.2em',
          }}
          onClick={() => handleMerge({ fields: fields as Array<keyof WorkBlockData>, suggestedData: suggestedWorkBlockProps })}
        >
          <ArrowBackIosIcon
            sx={{
              transform: 'scale(1.2) rotate(90deg)',
              transformOrigin: 'center center',

              position: 'relative',
              top: '0.2em',

              height: '1em',
              maxHeight: '1em',
              minHeight: '1em',
              width: '1em',
              maxWidth: '1em',
              minWidth: '1em',

              boxSizing: 'border-box',
              alignItems: 'center',
              color: theme.palette.primary.main,
            }}
          />
        </IconButton>
      </Box>

      {
        fields
          .filter(field => dictionary.some(item => item.key === field))
          .map((field, _) => {

            let fieldKey = field as keyof WorkBlockData;
            const value = suggestedWorkBlockProps[fieldKey];
            return (

              <Typography
                key={field}
                sx={{
                  display: 'block',
                  padding: '0.15em',
                  color: '#666',
                  fontStyle: 'italic',
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: 'block',
                    marginRight: 'auto',
                    width: '100%',
                  }}
                >
                  {dictionary.find(item => item.key === field)?.label || ''}
                </Box>

                <Box
                  component="span"
                  sx={{
                    paddingLeft: '1em',
                    display: 'block',
                  }}
                >
                  {

                    suggestedWorkBlockProps[field as keyof WorkBlockData] ?
                      (
                        value instanceof Temporal.PlainTime || typeof value === 'string'
                      ) && formatForDisplay(value) :
                      ''
                  }
                </Box>
              </Typography>
            )
          })
      }
    </Box>
  )
}
