import React from 'react';
import TextEntryField from "./TextEntryField";

interface FormField {
  name: string,
  label: string,
}

function createTextEntryFieldFactory(
  {
    handleInputChange,
    formStructure,
    formData,
  }: {
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement >) => void,
    formStructure: FormField[],
    formData: Record<string, any>,
  }) {

  function createField(
    {
      name,
      required = false,
      disabled = false,
      maxLength = 10000,
    }: {
      name: string;
      required?: boolean;
      disabled?: boolean;
      maxLength?: number;
    }
  ) {
    const label = formStructure.find((field) => field.name === name)?.label;
    if (!label) {
      throw new Error(`Label not found for field: ${name}`);
    }

    return (
      <TextEntryField
        name={name}

        className="entry-field"
        label={label}
        required={required}
        value={formData[name] ?? ''}
        handleInputChange={handleInputChange}
        disabled={disabled}
        maxLength={maxLength}
      />
    );
  }
  return { createField };
}

export default createTextEntryFieldFactory;
