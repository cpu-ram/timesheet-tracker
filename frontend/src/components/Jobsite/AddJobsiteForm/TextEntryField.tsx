import React from 'react';
import { TextField } from '@mui/material';

function TextEntryField({
  name,
  label,
  value,
  required = false,
  handleInputChange,
  disabled = false,
  maxLength,
  className
}: {
  name: string;
  label: string;
  value: string;
  required?: boolean;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled?: boolean;
  maxLength?: number;
  className: string;
}) {
  return (
    <TextField
      name={name}
      className={className}
      label={label}
      value={value}
      onChange={
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
