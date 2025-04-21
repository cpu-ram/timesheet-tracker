import { markMatchGroups } from '../../../utils/naiveSearch';
import { Typography, Box } from '@mui/material';

export const SearchMatchMarkedText = (props: { text: string; query: string }) => {
  const matchGroups = markMatchGroups(props.text, props.query);

  return (
    <Box
      component="span"
      sx={{
        display: 'inline',
      }}>
      {matchGroups.map((group, id) => (
        <Box
          key={id}
          component="span"
          sx={{
            fontWeight: group.isMatched ? 'bold' : 'normal',
            display: 'inline',
          }}
        >
          {group.content}
        </Box>
      ))}
    </Box>
  );
}