import { Grid, TextField } from '@mui/material';

function TextEntryField({
  name,
  label,
  value,
  required = false,
  handleInputChange,
  gridWidth = 6,
}): {
  name: string;
  label: string;
  value: string;
  required?: boolean;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  gridWidth?: number;
} {
  return (
    <Grid item xs={gridWidth}>
      <TextField
        name={name}
        label={label}
        value={value}
        onChange={handleInputChange}
        fullWidth
        required={required}
        inputProps={{
          autoComplete: 'off'
        }}
      />
    </Grid>
  )
}

export default TextEntryField;