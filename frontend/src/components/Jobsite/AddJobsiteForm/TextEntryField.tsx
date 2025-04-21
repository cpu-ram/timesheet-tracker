import { Grid, TextField } from '@mui/material';

function TextEntryField({
  name,
  label,
  value,
  required = false,
  handleInputChange,
  gridWidth = 6,
  disabled = false,
  maxLength
}): {
  name: string;
  label: string;
  value: string;
  required?: boolean;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  gridWidth?: number;
  disabled?: boolean;
  maxLength?: number;
} {
  return (
    <TextField
      name={name}
      label={label}
      value={value}
      onChange={
        (event) => {
          if (maxLength && event.target.value.toString().length > maxLength) {
            return;
          }
          handleInputChange(event)
        }
      }
      fullWidth
      required={required}
      inputProps={{
        autoComplete: 'off'
      }}
      disabled={disabled}

      sx={{
        backgroundColor: 'white',
      }}
    />
  )
}

export default TextEntryField;